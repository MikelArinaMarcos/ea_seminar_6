import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validator, FormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
  imports: [ NgIf, UpperCasePipe, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class PostDetailsComponent {
  @Input() post?: Post;
  @Input() idUser?: string;
  @Output() postUpdated = new EventEmitter<void>();

  newPost: FormGroup;
  editPost: FormGroup;
  update: boolean = false;
  lposts: Post[] = [];
  showAddedPosts: boolean = false;

  constructor(public postService: PostService, private formBuilder:FormBuilder) {
    this.newPost = this.formBuilder.group({
      author: ['',[Validators.required]],
      content: ['',[Validators.required]],
      title: ['',[Validators.required]]
    });
    this.editPost = this.formBuilder.group({
      author: [''],
      content: [''],
      title: ['',]
    });
  }

  ngOnInit(){
  this.fetchPosts();
  }

  // Method to fetch posts
  fetchPosts() {
    if (this.idUser){
      this.postService.getPosts(this.idUser).subscribe(lposts => {
      this.lposts = lposts;
      console.log("Posts", this.lposts);
      });
    }
  }

  createPost(): void{
    if (this.newPost.valid) {
      console.log(this.newPost.value)
      this.postService.createPost(this.newPost.value).subscribe((res: any) => {
        console.log("Post created", res.post);
        this.lposts.push(res.post);
        this.newPost.reset();
      });
    } else {
      console.error("Error.");
    }
  } 

  showAddUser(state: boolean) {
    this.showAddedPosts = state;
    console.log("Change mode", this.showAddedPosts);
  }

  updatePost(post?: Post): void {
    if (post && post.idPost) {
      const updatedPost: Post = {
        idPost: post.idPost,
        idUser: this.editPost.value.author || post.idUser,
        title: this.editPost.value.title || post.title,
        body: this.editPost.value.content || post.body
      };
      console.log(updatedPost);
      this.postService.updatePost(updatedPost).subscribe((res: any) => {
        console.log("Post updated", res.post);
        this.postUpdated.emit();
        this.toggleUpdateMode();
        this.fetchPosts();
      });
    } else {
      console.error("Error");
    }
  }
  toggleUpdateMode() {
    throw new Error('Method not implemented.');
  }
}