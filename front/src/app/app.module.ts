import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { SplitterModule } from "primeng/splitter";
import { ToolbarModule } from "primeng/toolbar";
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { ToastModule } from "primeng/toast";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SplitterModule,
    ToolbarModule,
    PanelMenuComponent,
    ToastModule,
  ],
  providers: [],
})
export class AppModule {}

// Since AppComponent is a standalone component, use bootstrapApplication in main.ts instead:
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app.component';
// 
// bootstrapApplication(AppComponent, {
//   providers: [
//     importProvidersFrom(AppModule)
//   ]
// });
