import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { PostsService } from '../../core/services/posts/posts.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createpost',
  imports: [CommonModule , ReactiveFormsModule , FormsModule],
  templateUrl: './createpost.component.html',
  styleUrl: './createpost.component.scss'
})
export class CreatepostComponent implements OnInit{

  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);

  savedSelectImage!:File; // saved image select
  content:string = ''; // saved content/body

  imageRequiredMsg = signal(true);


  get hasImage(): boolean {
    return !!this.savedSelectImage;
  }


  constructor(private flowbiteService:FlowbiteService) {}

  ngOnInit(): void {
    // flowbit
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
      });

  }

  selectImage(e:Event):void {

    const input =e.target as HTMLInputElement; //select input kolo

    if(input.files && input.files.length > 0) { // to sure there file select in input file
      this.savedSelectImage = input.files[0]; // select the image selected by user
      this.imageRequiredMsg.set(false);

    }else {
    this.savedSelectImage = undefined as any;
  }



  }

  createPost(e?: Event): void {
  e?.preventDefault();

  if (!this.savedSelectImage) {
    this.imageRequiredMsg.set(true);
    return;
  }

  const fd = new FormData();
  fd.append('image', this.savedSelectImage);
  if (this.content?.trim()) fd.append('caption', this.content.trim());

  this.postsService.createPost(fd).subscribe({
    next: (res) => {
      console.log(res);
      if(res.success == true) {
        Swal.fire({
        title: res.message,
        icon: "success",
        draggable: true
        });
      }

      // reset
      this.content = '';
      this.savedSelectImage = undefined as any;

      document.querySelector('[data-modal-hide="authentication-modal"]')
        ?.dispatchEvent(new Event('click'));

        // navigate to posts
        this.router.navigate(['/profile'])

    },
    error: (err) => console.log(err),
  });
}

}
