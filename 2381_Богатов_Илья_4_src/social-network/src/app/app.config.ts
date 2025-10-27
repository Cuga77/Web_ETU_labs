import {ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

import {provideHttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';

const socketConfig: SocketIoConfig = {url: 'https://localhost:443', options: {}};

export const appConfig: ApplicationConfig = {
  providers: [
    CookieService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig))
  ]
};
