import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { authInterceptor } from '../app/core/auth/intercepter/auth.intercepter';

import { routes } from './app.routes';
import { DengePilatesPreset } from './pilates-theme';

registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'tr' },

    provideRouter(routes),

    provideHttpClient(withInterceptors([authInterceptor])),

    provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: DengePilatesPreset,

        options: {
          prefix: 'p',
          darkModeSelector: 'system',
        },
      },
    }),
  ],
};
