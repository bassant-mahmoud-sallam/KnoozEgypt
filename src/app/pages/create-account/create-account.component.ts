import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { HomeService } from '../../core/services/homeServices/home.service';
import { Icountry } from '../../core/interfaces/icountry';

@Component({
  selector: 'app-create-account',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent implements OnInit{

  private formGroup = inject(FormBuilder);
  private authService = inject(AuthService);
  private homeService = inject(HomeService);
  private router = inject(Router);

  loading:boolean= false;
  errorMsgUserNotSignIN:string = "";
  successMsgUserSignIN:string = "";
  theCountries:Icountry[] =[];

  // get countries
  ngOnInit(): void {
    this.homeService.getCountries().subscribe({
      next:((res) => {
        //console.log(res.data);
        this.theCountries = res.data;
      }),
      error:((err) => {
        console.log(err);
      })
    })

  }


  registerForm:FormGroup = this.formGroup.group({
    name:['' , [Validators.required , Validators.minLength(3) , Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
    phone: ['', Validators.required],
    country_id: ['', Validators.required],
  } , {validators:this.confirmRePassword});



  submit() {
    if(this.registerForm.valid) {
      console.log(this.registerForm.value)

      // make spiner appear
      this.loading = true;

      // send form to api
      this.authService.sentRegisterForm(this.registerForm.value).subscribe({
        next:((res) => {
          this.loading = false;
          console.log(res)
          if(res.message == 'User registered successfully') {

             // navigate to sigin comp (wait second to appear success msg and go to sigin)
            setTimeout(() => {
              this.router.navigate(["/signin"]);
            }, 500);

            this.successMsgUserSignIN = res.message;

            this.errorMsgUserNotSignIN=""; // make false to show success msg

          }

        }),
        error:((err) => {
          this.loading = false;
          //console.log(err.error.errors.email[0]);
          this.errorMsgUserNotSignIN = err.error.errors.email[0];

        })
      })
    }
  }


  // custom validation to repassword
  confirmRePassword(group:AbstractControl) {

    const password = group.get("password")?.value;
    const rePassword = group.get("password_confirmation")?.value;

    return password === rePassword? null: {mismatch:true};

  }


}
