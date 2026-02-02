import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient:HttpClient){}

  getUserInfo():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/user`)
  }

  changePassword(data:object):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/user/change-password` , data);
  }
}
