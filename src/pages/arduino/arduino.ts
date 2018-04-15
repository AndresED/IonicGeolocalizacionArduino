import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the ArduinoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-arduino',
  templateUrl: 'arduino.html',
})
export class ArduinoPage {
  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  addressGlobal:any;
  deviceSeleccionado:any;
  connectStatus:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private bluetoothSerial: BluetoothSerial, private alertCtrl: AlertController) {
     bluetoothSerial.enable();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArduinoPage');
  }
  startScanning() {
   this.pairedDevices = null;
   this.unpairedDevices = null;
   this.gettingDevices = true;
   this.bluetoothSerial.discoverUnpaired().then((success) => {
     this.unpairedDevices = success;
     this.gettingDevices = false;
     success.forEach(element => {
       // alert(element.name);
     });
   },
     (err) => {
       console.log(err);
     })

   this.bluetoothSerial.list().then((success) => {
     this.pairedDevices = success;
   },
     (err) => {

     })
 }
 success = (data) => alert(data);
 fail = (error) => alert(error);

 selectDevice(address: any) {

   let alert = this.alertCtrl.create({
     title: 'Connectarte',
     message: 'Deseas conectarte con este dispositivo?',
     buttons: [
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       },
       {
         text: 'Conectar',
         handler: () => {
           this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
         }
       }
     ]
   });
   alert.present();

 }

 disconnect() {
   let alert = this.alertCtrl.create({
     title: 'Desconectar?',
     message: '¿Deseas Desconectarte de este dispositivo?',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       },
       {
         text: 'Desconectarte',
         handler: () => {
           this.bluetoothSerial.disconnect();
           this.connectStatus==false;
           this.addressGlobal=null;
           this.deviceSeleccionado=null;
         }
       }
     ]
   });
   alert.present();
 }
 sendMessage(address: any,name){
   if(this.addressGlobal!=address){
     alert("Usted no esta conectado a este dispositivo "+name)
   }else{
     if(this.connectStatus==false){
       alert("No estas conectado al dispositivo "+name);
     }else{
       this.bluetoothSerial.write("1").then(()=>{
         //alert("Mensaje enviado");
       }, this.fail);
     }
   }
 }
 connectDevice(address,name){
   this.bluetoothSerial.connect(address).subscribe(()=>{
     this.addressGlobal=address;
     this.deviceSeleccionado=name;
     this.connectStatus=true;
     this.success;
   }, this.fail);
 }
}