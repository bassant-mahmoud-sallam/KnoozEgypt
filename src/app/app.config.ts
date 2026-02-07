import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/headers/header.interceptor';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerModule } from "ngx-spinner";
import { provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/interceptors/screenloading/loading.interceptor';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

// Create Function To Load Files from assets/i18n/

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader();
// }

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes , withHashLocation() , withViewTransitions() , withInMemoryScrolling({scrollPositionRestoration:'top'})),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch() , withInterceptors([headerInterceptor , loadingInterceptor])),
    provideSweetAlert2({
            // Optional configuration
            fireOnInit: false,
            dismissOnDestroy: true,
        }),
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule , TranslateModule.forRoot({defaultLanguage:'en'})),
    ...provideTranslateHttpLoader({
      prefix: '/i18n/',
      suffix: '.json',
      enforceLoading: false,
      useHttpBackend: false,
    }),]
};


