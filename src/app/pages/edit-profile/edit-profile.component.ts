import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user/user.service';
import { Iuser } from '../../core/interfaces/iuser';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule , RouterLink , TranslatePipe],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit{

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  saving = signal(false);
  user = signal<Iuser | null>(null);

  // files
  profileFile = signal<File | null>(null);
  coverFile = signal<File | null>(null);

  // previews (للصورة قبل الرفع)
  profilePreview = signal<string | null>(null);
  coverPreview = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
    bio: [''],
  });

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (res) => {
        const u: Iuser = res.data;
        this.user.set(res.data);

        this.form.patchValue({
          name: u.name ?? '',
          phone: u.phone ?? '',
          bio: u.bio ?? '',
        });

        this.profilePreview.set(u.profile_image ?? null);
        this.coverPreview.set(u.cover_image ?? null);
      },
      error: (err) => console.log(err),
    });
  }

  onPickProfile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.profileFile.set(file);
    this.profilePreview.set(URL.createObjectURL(file));
  }

  onPickCover(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.coverFile.set(file);
    this.coverPreview.set(URL.createObjectURL(file));
  }

  done() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fd = new FormData();

    fd.append('name', this.form.value.name!);
    if (this.form.value.phone) fd.append('phone', this.form.value.phone);
    if (this.form.value.bio) fd.append('bio', this.form.value.bio);

    // الصور اختيارية
    if (this.profileFile()) fd.append('profile_image', this.profileFile()!);
    if (this.coverFile()) fd.append('cover_image', this.coverFile()!);

    this.saving.set(true);

    this.userService.updateProfile(fd).subscribe({
      next: (res) => {
        console.log(res)
        this.saving.set(false);

        if (res.success) {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.log(err.error.errors.cover_image);
        if(err.error.errors.cover_image) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.errors.cover_image[0],
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.errors.profile_image[0],
          });
        }
      },
    });
  }

}
