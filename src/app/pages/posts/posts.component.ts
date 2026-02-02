import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, PLATFORM_ID, Signal, signal, ViewChild } from '@angular/core';
import { PostsService } from '../../core/services/posts/posts.service';
import { isPlatformBrowser } from '@angular/common';
import { IPost } from '../../core/interfaces/i-post';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { Router} from "@angular/router";
import { CommentComponent } from "../../shared/comment/comment.component";
import { UserService } from '../../core/services/user/user.service';


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [NavbarComponent, CommentComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit , AfterViewInit{


  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  mainUserId = signal<number | null>(null);
  posts = signal<IPost[]>([]);
  currentPage = signal(1);

  perPage = 15;

  hasMorePages = signal(true);
  loading = signal(false);

  private observer?: IntersectionObserver;

  @ViewChild('sentinel') sentinel!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.loadMore();

    // get id of user
    this.userService.getUserInfo().subscribe({
      next:((res) => {
        console.log(res.data.id);
        this.mainUserId.set(res.data.id);
      }),
      error:((err) => {
        console.log(err);
      })
    })
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    });

    this.observer.observe(this.sentinel.nativeElement);
  }

  loadMore(): void {
    if (this.loading() || !this.hasMorePages()) return;

    this.loading.set(true);

    this.postsService
      .getAllPosts(this.currentPage(), this.perPage)
      .subscribe({
        next: (res) => {
          console.log(res.data);
          const newPosts = res.data ?? [];
          const pagination = res.pagination;


          this.posts.update((old) => [...old, ...newPosts]);

          this.hasMorePages.set(!!pagination?.has_more_pages);

          this.currentPage.update((p) => p + 1);

          this.loading.set(false);
        },

        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }


  // like post togle
  toggleLike(post: IPost) {
    const prevLiked = post.is_liked;
    const prevCount = post.likes_count;

    post.is_liked = !post.is_liked;
    post.likes_count = post.is_liked ? prevCount + 1 : prevCount - 1;

    // update signal array reference
    this.posts.update(list => [...list]);

    this.postsService.toggleLikePost(post.id).subscribe({
      next: ((res) => {
        //console.log(res);
      }),
      error: (err) => {
        // rollback
        post.is_liked = prevLiked;
        post.likes_count = prevCount;
        this.posts.update(list => [...list]);
        console.log(err);
      }
    });
  }

  // save
  toggleSave(post: IPost) {
    const prevSaved = post.is_saved;
    post.is_saved = !post.is_saved;
    this.posts.update(list => [...list]);

    this.postsService.toggleSavePost(post.id).subscribe({
      next: ((res) => {
        //console.log(res);
      }),
      error: (err) => {
        post.is_saved = prevSaved;
        this.posts.update(list => [...list]);
        console.log(err);
      }
    });
  }




  // to open/ close comment for each post
  openComments = signal<Record<number, boolean>>({});

  toggleComments(postId: number) {
    this.openComments.update(map => ({
      ...map,
      [postId]: !map[postId]
    }));
  }

  isCommentsOpen(postId: number) {
    return !!this.openComments()[postId];
  }


  updateCommentsCount(postId: number, delta: number) {

  this.posts.update((list) =>
    list.map((p) =>
      p.id === postId
        ? {
            ...p,
            comments_count: p.comments_count + delta
          }
        : p
    )
  );

}

// go profile
  goProfile(userId:number):void {
    if(userId == this.mainUserId()) {
       // navigate to profile
      this.router.navigate(['/profile']);
    }else {
      // navigate to another profile
      this.router.navigate(['/anotherUser' , userId]);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
