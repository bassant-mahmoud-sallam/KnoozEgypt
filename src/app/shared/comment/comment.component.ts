import { Component, inject, Input,} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../core/services/comment/comment.service';
import { Icomment } from '../../core/interfaces/icomment';
import { UserService } from '../../core/services/user/user.service';
import Swal from 'sweetalert2';

import { EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-comment',
  imports: [ReactiveFormsModule , TranslatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {


  private readonly formBuilder = inject(FormBuilder);
  private readonly commentService = inject(CommentService);
  private readonly userService = inject(UserService);

  @Input({required:true}) idPost!:number |undefined;  // post id from parent(post);

  @Output() commentCountChange = new EventEmitter<number>();



  mainUserId!:number;

  commentsList:Icomment[] =[]

  createCommentForm!:FormGroup;

  ngOnInit(): void {

    // create form here because idpost is input
    this.createCommentForm = this.formBuilder.group({
      comment:[null , [Validators.required]]
    })


    // get all comment for post
    this.commentService.getPostComments(this.idPost!).subscribe({
      next:((res) => {
        console.log(res.data);
        this.commentsList = res.data;

      }),
      error:((err) => {
        console.log(err);
      })
    });

    // get id of user
    this.userService.getUserInfo().subscribe({
      next:((res) => {
        console.log(res.data.id);
        this.mainUserId = res.data.id;
      }),
      error:((err) => {
        console.log(err);
      })
    })
  }

  submitComment():void {
    if(this.createCommentForm.valid) {
      this.commentService.addComment(this.createCommentForm.value , this.idPost!).subscribe({
      next:((res) => {
        console.log(res.data);
        if(res.success === true) {
          // updata array of comment to show new comment
          this.commentsList.unshift(res.data);

          this.commentCountChange.emit(+1);

          this.createCommentForm.get("comment")?.reset();

        }
      }),
      error:((err) => {
        console.log(err);
      })
    })
    }
  }

  // to check that comment for that mainuser
  isMyComment(comment: Icomment): boolean {
    return comment.user.id === this.mainUserId;
  }


  // delete comment for mainuser
  deleteComment(commentId: number):void {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#2b2156",
      confirmButtonText: "Yes, delete it!"
      }).then((result) => {
          if (result.isConfirmed) { // is confirm delete then call api (call api when is clicked delete in confirm)

            this.commentService.deleteComment(commentId).subscribe({
              next: (res) => {
                console.log(res);

                if(res.message == 'Comment deleted successfully') {
                  // remove from UI (update commentsList)
                  this.commentsList = this.commentsList.filter(
                    (c) => c.id !== commentId
                  );

                  this.commentCountChange.emit(-1);
                }

              },
              error: (err) => {
                console.log(err);
              }
            });

          }
        });
}



}
