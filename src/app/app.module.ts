import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ArduinoPage } from '../pages/arduino/arduino';
import { AgPage } from '../pages/ag/ag';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BluetoothProvider } from '../providers/bluetooth/bluetooth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ArduinoPage,
    AgPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ArduinoPage,
    AgPage 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BluetoothProvider
  ]
})
export class AppModule {}
