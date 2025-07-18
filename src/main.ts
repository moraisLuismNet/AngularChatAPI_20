import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/AppComponent';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
}).catch((err) => console.error(err));
