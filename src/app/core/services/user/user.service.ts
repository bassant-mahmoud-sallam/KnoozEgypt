import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';
import { Iuser } from '../../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // signal: user data global
  // user = signal<Iuser | null>(null);

  constructor(private httpclient:HttpClient){}

  // get user info
  getUserInfo():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/user`)
  }

  // update profile
  updateProfile(data:object):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/user/update` , data);
  }
}
