import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";

export const APP_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "products",
    pathMatch: "full",
  },
  {
    path: "products",
    loadComponent: () =>
      import("./products/features/product-list/product-list.component").then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./cart/features/cart-view/cart-view.component").then(
        (m) => m.CartViewComponent
      ),
  },
  {
    path: "**",
    redirectTo: "products",
  },
];
