import { Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { HomeService } from '../../core/services/homeServices/home.service';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../../core/services/user/user.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/services/auth/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive , CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  private readonly idPlatform = inject(PLATFORM_ID)

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router)

  @Input() variant: 'transparent' | 'purple' = 'transparent';

  userName:string ="";
  userEmail:string ="";
  userImageUrl:string ="";

  selectedLangCode = 'en';
  selectedLangLabel = 'English (US)';

  constructor(private flowbiteService:FlowbiteService) {}

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: ((res) => {
        console.log(res.data);
        this.userName = res.data.name;
        this.userEmail = res.data.email;
        this.userImageUrl = res.data.cover_image;
      }),
      error: ((err) => {
        console.log(err);
      })
    });

    // flowbit
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    // lang
    if(isPlatformBrowser(this.idPlatform)) {

      const savedCode = localStorage.getItem('lang') || 'en';
      this.selectedLangCode = savedCode;
      this.selectedLangLabel = savedCode === 'ar' ? 'Arabic' : 'English (US)';

    }

  }

  // sign out
  signOut():void {
    // call api
    this.authService.logoOut().subscribe({
      next:((res) => {
        if(res.success == true) {
          // remove token from localstorage
          localStorage.removeItem("userToken");
          // navigate to login
          this.router.navigate(['/signin']);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      }),
      error:((err) => {
        console.log(err);
      })
    })
  }

  // lang
  changeLang(code: 'en' | 'ar', label: string) {
    this.selectedLangCode = code;
    this.selectedLangLabel = label;
    localStorage.setItem('lang', code);
}

}
