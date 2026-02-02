import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../../core/services/homeServices/home.service';
import { UserService } from '../../core/services/user/user.service';
import { Iuser } from '../../core/interfaces/iuser';
import { PostsService } from '../../core/services/posts/posts.service';
import { IPost } from '../../core/interfaces/i-post';
import { RouterLink } from "@angular/router";


type Tab = 'posts' | 'saved';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  private readonly homeService = inject(HomeService);
  private readonly userService = inject(UserService);
  private readonly postsService = inject(PostsService);

  viewUserProfile!:Iuser; // user info
  savedPosts:IPost[] =[]; // saved posts
  userPosts:IPost[] =[];  // user posts


  tab: Tab = 'posts';


  ngOnInit(): void {

    // get user info from view user profile by user id
    this.userService.getUserInfo().subscribe({

      next:((res) => {
        let userId = res.data.id;
        if(res.success == true) {

          this.homeService.viewUserProfile(userId).subscribe({
            next:((res) => {
              // console.log(res);
              if(res.success == true) {
                console.log(res.data);
                this.viewUserProfile = res.data.info;
                this.userPosts = res.data.posts;
                //console.log(this.userPosts[0].image)
              }
            }),
            error:((err) => {
              console.log(err);
            })
          })
        }
      }),

      error:((err) => {
        console.log(err);
      })
    });


    //get saved posts
    this.postsService.getSavedPosts().subscribe({
      next:((res) => {
        console.log(res.data);
        this.savedPosts = res.data;
      }),
      error:((err) => {
        console.log(err);
      })
    })
  }

  setTab(t: Tab) {
    this.tab = t;
  }

}
