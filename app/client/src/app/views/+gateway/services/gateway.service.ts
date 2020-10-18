import { Injectable } from '@angular/core';

import {environment as env} from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gateway, PeripheralDevice } from '@app/core/interfaces/gateway.interface';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllGateways(): Observable<any> {
    return this.httpClient.get(`${env.apiURL}/gateway`);
  }

  addGateway(gateway: Gateway): Observable<any> {
    return this.httpClient.post(`${env.apiURL}/gateway/create`, gateway);
  }

  addDevice(gatewayID: string, device: PeripheralDevice): Observable<any> {
    return this.httpClient.patch(`${env.apiURL}/gateway/${gatewayID}/addDevice`, device);
  }

  removeDevice(gatewayID: string, deviceID: string): Observable<any> {
    return this.httpClient.patch(`${env.apiURL}/gateway/${gatewayID}/removeDevice/${deviceID}`, {});
  }

  getOneGateway(gatewayID: string): Observable<any> {
    return this.httpClient.get(`${env.apiURL}/gateway/${gatewayID}`);
  }
}
