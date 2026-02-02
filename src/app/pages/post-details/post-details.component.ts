import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PostsService } from '../../core/services/posts/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPost } from '../../core/interfaces/i-post';
import { CommentComponent } from "../../shared/comment/comment.component";
import { RouterLink } from "@angular/router";
import { UserService } from '../../core/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-details',
  imports: [CommentComponent , RouterLink],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent implements OnInit{

  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  post = signal<IPost | null>(null);
  commentsOpen = signal(false);
  mainUserId = signal<number | null>(null);
  menuOpen = signal(false);

  editCaption = signal('');
  editModalOpen = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      const id = Number(p.get('id'));
      this.postsService.getPostDetails(id).subscribe({
        next: (res) => {
          if (res.success) this.post.set(res.data);
        },
        error: (err) => console.log(err),
      });
    });

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

  toggleComments() {
    this.commentsOpen.update(v => !v);
  }

  // toggle Like
  toggleLike() {
    const p = this.post();
    if (!p) return;

    const prevLiked = p.is_liked;
    const prevCount = p.likes_count;

    this.post.set({
      ...p,
      is_liked: !p.is_liked,
      likes_count: !p.is_liked ? prevCount + 1 : prevCount - 1,
    });

    this.postsService.toggleLikePost(p.id).subscribe({
      error: (err) => {
        this.post.update(curr => curr ? { ...curr, is_liked: prevLiked, likes_count: prevCount } : curr);
        console.log(err);
      },
    });
  }

  // save
  toggleSave() {
    const p = this.post();
    if (!p) return;

    const prevSaved = p.is_saved;

    this.post.set({ ...p, is_saved: !p.is_saved });

    this.postsService.toggleSavePost(p.id).subscribe({
      error: (err) => {
        this.post.update(curr => curr ? { ...curr, is_saved: prevSaved } : curr);
        console.log(err);
      },
    });
  }

  // comments count delta from child
  updateCommentsCount(delta: number) {
    this.post.update(curr => curr ? { ...curr, comments_count: curr.comments_count + delta } : curr);
  }



  // check that my post
  isMyPost = computed(() => {
    const p = this.post();
    const userId = this.mainUserId();

    if (!p || !userId) return false;

    return p.user.id === userId;
  });

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  // delete post
  deletePost() {
    const p = this.post();
    if (!p) return;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#2b2156",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
              this.postsService.deletePost(p.id).subscribe({
                next: (res) => {
                  console.log(res);

                  Swal.fire({
                      position: "top-end",
                      icon: "success",
                      title: res.message,
                      showConfirmButton: false,
                      timer: 1500
                    });


                  // back
                  history.back();
                },
                error: (err) => console.log(err),
              });
            }})


  }

  // update post
  openEditModal() {
    const p = this.post();
    if (!p) return;

    this.editCaption.set(p.caption || '');
    this.editModalOpen.set(true);
  }

  updatePost() {
    const p = this.post();
    if (!p) return;

    const fd = new FormData();
    fd.append("caption", this.editCaption());

    this.postsService.updatePost(p.id, fd).subscribe({
        next: (res) => {
            console.log(res);

            // update UI مباشرة
            this.post.update(curr =>
                curr ? { ...curr, caption: this.editCaption() } : curr
            );

            this.editModalOpen.set(false);
        },
        error: (err) => console.log(err),
    });
  }


  back():void {
    history.back();
  }

}


