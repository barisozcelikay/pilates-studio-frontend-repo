import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { DengePilatesPreset } from './pilates-theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(),

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
