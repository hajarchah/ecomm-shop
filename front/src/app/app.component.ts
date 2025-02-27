import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <app-header></app-header>
    <main>
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 130px);
      padding-bottom: 2rem;
    }
  `]
})
export class AppComponent {
  title = "ALTEN SHOP";
}
