import { enableProdMode, importProvidersFrom } from "@angular/core";

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";
import { AppModule } from "app/app.module";
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
