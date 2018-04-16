import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ModalController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public geolocation: Geolocation,public modalCtrl: ModalController) {

  }

  ionViewDidLoad(){
    this.loadMap();
    this.startNavigating();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();
    }, (err) => {
      console.log(err);
    });

  }

  addMarker(){
    var latlng = {lat: parseFloat(this.map.getCenter().lat()), lng: parseFloat(this.map.getCenter().lng())};
    var geocoder = new google.maps.Geocoder;
    var content;
    geocoder.geocode({'location': latlng}, function(results, status) {
        console.log(results[0].formatted_address);
         if (status === 'OK') {
            content=results[0].formatted_address;
           } else {
             window.alert('No results found');
           }
       });
    console.log("Dirección:"+content);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });



    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }
  startNavigating(){

        let directionsService = new google.maps.DirectionsService; //RUTAS
        let directionsDisplay = new google.maps.DirectionsRenderer; // RENDERIZAR RUTAS
        directionsDisplay.setMap(this.map);
        directionsDisplay.setPanel(this.directionsPanel.nativeElement);

        directionsService.route({
            origin:  {lat: -7.8876717, lng: -79.2211828},
            destination:  {lat: -7.8917998, lng: -79.2251388},
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
            //console.log(data);
            //console.log(data.start_point.lat());
            for (let i = 0; i < data.length; i++) {
              array.push({
                distance: data[i].distance ,
                duration: data[i].duration,
                //instructions:data[i].instructions,
                maneuver:data[i].maneuver,
                start_location:{ lat:data[i].start_location.lat(), lng: data[i].start_location.lng() },
                end_location:{ lat:data[i].end_location.lat(), lng: data[i].end_location.lng() },
              });
            }
            this.dataRoute=array;
            //console.log(this.dataRoute)
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res)
            } else {
                console.warn(status);
            }

        });

    }

    showModal(){
      let modal = this.modalCtrl.create(ArduinoPage,{ dataRoute: this.dataRoute });
      modal.present();
    }
}
