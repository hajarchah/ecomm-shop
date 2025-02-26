import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { ToastModule } from "primeng/toast";
import { CartBadgeComponent } from "./cart/ui/cart-badge/cart-badge.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    RouterModule, 
    SplitterModule, 
    ToolbarModule, 
    PanelMenuComponent, 
    ToastModule,
    CartBadgeComponent
  ],
})
export class AppComponent {
  title = "ALTEN SHOP";
}
