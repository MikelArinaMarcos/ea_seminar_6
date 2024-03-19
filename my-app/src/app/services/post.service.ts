import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  getPosts(idUser: string) {
    return this.http.get<Post[]>('http://127.0.0.1:3000/posts/'+idUser);
  }

  updatePost(editPost : Post) {
    return this.http.put('http://127.0.0.1:3000/posts/'+ editPost.idPost, editPost);
  }

  createPost(newPost : Post |undefined) {
    return this.http.post('http://127.0.0.1:3000/posts', newPost);
  }
}