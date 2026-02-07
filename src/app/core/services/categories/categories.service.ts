import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {



  constructor(private httpclient:HttpClient){}

  getCategories():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/categories?page=1&per_page=15`);
  }

  getPlacesbyCategory(idCategory:string , governorateId?: string):Observable<any> {
    const govParam = governorateId ? `&governorate_id=${governorateId}` : '';
    return this.httpclient.get(`${enviroment.baseUrl}/categories/${idCategory}/places?page=1&per_page=15${govParam}`);
  }

}
