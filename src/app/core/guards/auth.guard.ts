import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const idPlatform = inject(PLATFORM_ID)

  if (isPlatformBrowser(idPlatform)) {
    if (localStorage.getItem("userToken") !== null) {
      return true;  // logged in
    } else {
      router.navigate(['/signin']);
      return false;
    }
  } else { // in server
    return false;

  }
};
