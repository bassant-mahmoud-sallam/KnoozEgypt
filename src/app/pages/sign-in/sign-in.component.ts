import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';



@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent  {

  private formGroup = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading:boolean= false;
  errorMsgUserNotSignIN:string = "";
  successMsgUserSignIN:string = "";



  signInForm:FormGroup = this.formGroup.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });



  submit() {
    if(this.signInForm.valid) {
      //console.log(this.signInForm.value)

      // make spiner appear
      this.loading = true;

      // send form to api
      this.authService.setSigninForm(this.signInForm.value).subscribe({
        next:((res) => {
          //console.log(res.data.token);
          this.loading = false;
          if(res.message == 'Login successful') {

            // (wait second to appear success msg and go to home)
            setTimeout(() => {
              // (1) save token in local storage
              localStorage.setItem("userToken" , res.data.token);

              // (2) navigate to home
              this.router.navigate(["/home"]);
            }, 500);

            this.successMsgUserSignIN = res.message;

            this.errorMsgUserNotSignIN=""; // make false to show success msg

          }

        }),
        error:((err) => {
          this.loading = false;
          console.log(err);
          this.errorMsgUserNotSignIN = err.error.message;

        })
      })
    }
  }


}
