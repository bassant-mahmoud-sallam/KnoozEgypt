import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private httpclient:HttpClient) { }

  //recommended places
  getRecommenedPlaces():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/places?type=recommended&page=1&per_page=15`)
  }

  // toggle save place
  toggleSavePlace(idPlace:number):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/places/${idPlace}/toggleSave` , {});
  }

  // place detalis
  getPlaceDetails(idPlace:string):Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/places/${idPlace}`);
  }

  // add rate place
  addRatePlace(idPlace:number , rating: number):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/places/${idPlace}/rate` , {rating});
  }

  // get place rate
  getPlaceRate(idPlace:string):Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/places/${idPlace}/ratings`);
  }



}
