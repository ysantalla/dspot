import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {environment as env} from '@env/environment';
import { User } from '@app/core/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.httpClient.get(`${env.apiURL}/user`);
  }

  getOneById(id: string): Observable<any> {
    return this.httpClient.get(`${env.apiURL}/user/${id}`);
  }

  create(entity: User): Observable<any> {
    return this.httpClient.post(`${env.apiURL}/user`, entity);
  }

  update(id: string, entity: User): Observable<any> {
    return this.httpClient.put(`${env.apiURL}/user/${id}`, entity);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${env.apiURL}/user/${id}`);
  }
}
