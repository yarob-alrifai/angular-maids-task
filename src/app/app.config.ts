import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgxsReduxDevtoolsPluginModule, withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { NgxsModule, provideStore } from '@ngxs/store';
import { UserState } from './state/user';
import { provideHttpClient } from '@angular/common/http';
import { adminRoutes } from './admin/admin.routes';
import { USER_ENGINE } from './services/interfaces/user.service.interface';
import { UserService } from './services/user-services/user.service';
import { LOCAL_STORAGE_ENGINE } from './services/interfaces/localStorage.service.interface';
import { LocalStorageService } from './services/localStorage/localStorage.service';
import { UserBackendService } from './services/backend-services/user-backend.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: USER_ENGINE,
      useClass: UserService,
    },
    {
      provide: LOCAL_STORAGE_ENGINE,
      useClass: LocalStorageService,
    },

    UserBackendService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideRouter(adminRoutes),

    provideHttpClient(),


    importProvidersFrom(
      NgxsModule.forRoot([UserState]),
      NgxsReduxDevtoolsPluginModule.forRoot(),
    ),


    // provideStore([UserState], withNgxsReduxDevtoolsPlugin()), 
    provideAnimationsAsync(),
  ],
};
