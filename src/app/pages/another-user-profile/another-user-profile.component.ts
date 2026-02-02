import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../core/services/homeServices/home.service';
import { Iuser } from '../../core/interfaces/iuser';
import { IPost } from '../../core/interfaces/i-post';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-another-user-profile',
  imports: [RouterLink],
  templateUrl: './another-user-profile.component.html',
  styleUrl: './another-user-profile.component.scss'
})
export class AnotherUserProfileComponent implements OnInit{

  private readonly activatedRoutect = inject(ActivatedRoute);
  private readonly homeService = inject(HomeService);

  viewUserProfile!:Iuser; // user info
  userPosts:IPost[] =[];  // user posts

  ngOnInit(): void {
    this.activatedRoutect.paramMap.subscribe({
      next:((p) => {

        let anotherUserId = p.get('id')!;
        this.homeService.viewUserProfile(anotherUserId).subscribe({
          next:((res) => {
            if(res.success == true) {
                //console.log(res.data.posts);
                this.viewUserProfile = res.data.info;
                this.userPosts = res.data.posts;
              }
          }),
          error:((err) => {
            console.log(err);
          })
        })

      })
    })

  }

}
