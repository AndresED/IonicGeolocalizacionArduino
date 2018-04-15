import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BluetoothProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BluetoothProvider {
  /**
	 * Inicializa todas las variables a utilizar en el provider.
	 * @param _storage Variable para guardar en memoria.
	 */
   _storage:any;
  constructor(public http: HttpClient) {
    console.log('Hello BluetoothProvider Provider');
  }
  public getAll(): Promise<any> {

		let macsBluetooth: MacBluetoothList[] = [];

		return this._storage.forEach((value: MacBluetooth, key: string, iterationNumber: number) => {
			let macBluetooth = new MacBluetoothList();
			macBluetooth.key = key;
			macBluetooth.macBluetooth = value;
			macsBluetooth.push(macBluetooth);
		})
			.then(() => {
				return Promise.resolve(macsBluetooth);
			})
			.catch((error) => {
				return Promise.reject(error);
			});
	}
}
export class MacBluetooth {
	name: string;
	mac: string;
	active: boolean;
}
export class MacBluetoothList {
	key: string;
	macBluetooth: MacBluetooth;
}
