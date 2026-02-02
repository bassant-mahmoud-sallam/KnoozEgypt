import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const idPlatform = inject(PLATFORM_ID)

    if(isPlatformBrowser(idPlatform)) {

      if (localStorage.getItem("userToken") !== null) { // if user login

        router.navigate(['/home']); // navigate to home
        return false;  // (no go to login)

      } else { //if user not login

        return true; // go to login
      }

    } else { // in server
      return false;
    }
};
