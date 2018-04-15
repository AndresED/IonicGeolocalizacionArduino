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

    }, (err) => {
      console.log(err);
    });

  }
  addMarker(){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

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
            console.log(res);
            let array=[];
            for (let i = 0; i < res.routes[0].overview_path.length; i++) {
                array.push({
                  location: { lat: res.routes[0].overview_path[i].lat(), lng: res.routes[0].overview_path[i].lng() },
                  stopover: true,
                });
                this.waypoints=array;
                console.log(res.routes[0].overview_path[i].lat(),res.routes[0].overview_path[i].lng());
            }
            //console.log(this.waypoints);
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res)
            } else {
                console.warn(status);
            }

        });

    }

    showModal(){
      let modal = this.modalCtrl.create(ArduinoPage);
      modal.present();
    }
}
