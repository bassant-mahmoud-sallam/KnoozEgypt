import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {



  constructor(private httpclient:HttpClient){}

// get all comment for post
  getPostComments(idPost:number):Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/posts/${idPost}/comments?page=1&per_page=20`);
  }

  // add comment for post
  addComment(data:object , idPost:number):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/posts/${idPost}/comments` , data);
  }

  //delete comment for post
  deleteComment(idcommet:number):Observable<any> {
    return this.httpclient.delete(`${enviroment.baseUrl}/posts/comments/${idcommet}`);
  }

}
