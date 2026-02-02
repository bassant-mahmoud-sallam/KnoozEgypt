import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpclient:HttpClient){}

  // get all posts for all usets
  getAllPosts(page: number, perPage = 15):Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/posts?page=1&per_page=15`, {
      params: { page, per_page: perPage }
    });
  }

  // get post details
  getPostDetails(postId:number):Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/posts/${postId}`)
  }

  // get saved posts for user
  getSavedPosts():Observable<any> {
    return this.httpclient.get(`${enviroment.baseUrl}/posts/saved`)
  }

  // toggle like post
  toggleLikePost(postId:number):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/posts/${postId}/toggleLike`, {});
  }

  // toggle save post
  toggleSavePost(postId:number):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/posts/${postId}/toggleSave`, {});
  }

  // create post
  createPost(data:object):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/posts`, data);
  }

  // delete post
  deletePost(postId:number):Observable<any> {
    return this.httpclient.delete(`${enviroment.baseUrl}/posts/${postId}`);
  }

  // update post
  updatePost(postId:number , data:object):Observable<any> {
    return this.httpclient.post(`${enviroment.baseUrl}/posts/update/${postId}`, data);
  }


}
