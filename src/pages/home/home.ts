import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
   map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {

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
             travelMode: 'DRIVING',
             drivingOptions: {
               departureTime: new Date(/* now, or future date */),
               trafficModel: 'pessimistic'
             },
             unitSystem: google.maps.UnitSystem.IMPERIAL,
            
        }, (res, status) => {
            console.log(res);
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res)
            } else {
                console.warn(status);
            }

        });

    }

}
