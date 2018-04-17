import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ModalController,ViewController } from 'ionic-angular';
import {ArduinoPage} from '../arduino/arduino';
declare var google;

@Component({
  selector: 'page-ag',
  templateUrl: 'ag.html'
})
export class AgPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
   map: any;
   bounds: any = null;
   myLatLng: any;
   waypoints: any[];
   isConfigurate:boolean=false;
   dataRoute:any={};
   pOrigen:any;
   pDestino:any;
   markers:any=[];
  constructor(public navCtrl: NavController, public geolocation: Geolocation,public modalCtrl: ModalController,public viewController:ViewController) {
      console.log(this.isConfigurate);
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.pOrigen=latLng;
      console.log(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      //SETEANDO AGREGAR MARCADOR
      google.maps.event.addListener(this.map, 'click', (event) => {
        this.addMarker(event.latLng.lat(),event.latLng.lng(),"destino");
      });
      this.addMarker(position.coords.latitude,position.coords.longitude,"origen");

    }, (err) => {
      console.log(err);
    });


  }
  updatePosition(){

  }
  addMarker(latitude,longitude,type){

    var latlng = {lat: latitude, lng: longitude};
    var geocoder = new google.maps.Geocoder;
    var content;
    if(this.markers.length<2){
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latlng
      });
      this.markers.push(marker);
      //AGREGANDO EVENTO CLICK PARA ELIMINAR UN MARCADOR
      google.maps.event.addListener(marker, 'click', (event) => {
        this.deleteMarker(1);
      });

      if(type==="origen"){
        geocoder.geocode({'location': latlng}, (results, status)=> {
            content="Posición actual: "+results[0].formatted_address;
            this.addInfoWindow(marker, content);
        });
      }else{
        this.pDestino=latlng;
        geocoder.geocode({'location': latlng}, (results, status)=> {
            content="Destino: "+results[0].formatted_address;
            this.addInfoWindow(marker, content);
        });
      }
    }
  }

  deleteMarker(position){
      console.log(position);
      if(position==0){
        alert("No se puede eliminar la posición de origen")
      }else{
          this.markers[position].setMap(null);
          this.markers.splice(1, 1);
      }
  }
  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    infoWindow.open(this.map, marker);
  }
  startNavigating(){

        let directionsService = new google.maps.DirectionsService; //RUTAS
        let directionsDisplay = new google.maps.DirectionsRenderer; // RENDERIZAR RUTAS
        directionsDisplay.setMap(this.map);
        directionsDisplay.setPanel(this.directionsPanel.nativeElement);

        directionsService.route({
            origin:  this.pOrigen,
            destination:  this.pDestino,
            provideRouteAlternatives: false,
            waypoints: this.waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true,
             drivingOptions: {
               departureTime: new Date(/* now, or future date */),
               trafficModel: 'pessimistic'
             },

        }, (res, status) => {
            let array=[];
            let data=res.routes[0].legs[0].steps;
            for (let i = 0; i < data.length; i++) {
              array.push({
                distance: data[i].distance ,
                duration: data[i].duration,
                maneuver:data[i].maneuver,
                start_location:{ lat:data[i].start_location.lat(), lng: data[i].start_location.lng() },
                end_location:{ lat:data[i].end_location.lat(), lng: data[i].end_location.lng() },
              });
            }
            this.dataRoute=array;
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res)
            } else {
                console.warn(status);
            }

        });

    }
    showModal(){
      if(this.markers.length>=2){
        let modal = this.modalCtrl.create(ArduinoPage,{ dataRoute: this.dataRoute });
        modal.present();
        modal.onDidDismiss(  data =>{
          this.isConfigurate=data.isConfigurate;
          this.startNavigating();
          console.log(this.isConfigurate);
        })
      }else{
        alert("Es necesario de que fije el destino final antes de enviar las instrucciones");
      }
    }
}
