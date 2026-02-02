import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpclient:HttpClient) { }

  // categories & recommendation that appear in home
  getHomeData():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/home`)
  }

  // view user info
  viewUserProfile(userId:number|string):Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/profile/${userId}`);
  }

  //get  governorates
  getGovernorates():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/governorates`);
  }

  // get countries
  getCountries():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/countries`);
  }

}
