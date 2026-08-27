import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { authInterceptor } from '../app/core/auth/intercepter/auth.intercepter';

import { routes } from './app.routes';
import { DengePilatesPreset } from './pilates-theme';

export const appConfig: ApplicationConfig = {
  providers: [
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
