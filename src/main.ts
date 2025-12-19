import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/app/shared/auth.interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    ...appConfig.providers
  ]
})
.catch((err) => console.error(err));
