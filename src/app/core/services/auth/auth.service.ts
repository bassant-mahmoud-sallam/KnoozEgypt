import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private httpclient:HttpClient){}

  setSigninForm(data:object):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/login`,data)
  }

  sentRegisterForm(data:object):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/register` , data);
  }


  // logout
  logoOut():Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/logout` , {});
  }


}
