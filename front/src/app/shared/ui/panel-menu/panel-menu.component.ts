import { Component, HostListener } from "@angular/core";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: "app-panel-menu",
  standalone: true,
  imports: [PanelMenuModule, CommonModule],
  template: `
    <div class="menu-container" [class.compact]="isCompact">
      
      <p-panelMenu 
        [model]="items" 
        [multiple]="false"
        styleClass="custom-panel-menu w-full -mt-1" 
        [style]="{'margin-top': '1rem'}"
      ></p-panelMenu>
      
      <div class="menu-footer" *ngIf="!isCompact">
        <div class="user-info">
          <div class="avatar">
            <img src="./assets/images/johndoe.jpeg" alt="User Avatar" />
            <span class="status-indicator"></span>
          </div>
          <div class="user-details">
            <span class="user-name">John Doe</span>
            <span class="user-role">Admin</span>
          </div>
        </div>
        <i class="pi pi-sign-out logout-icon" (click)="logout()"></i>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--surface-card);
      border-right: 1px solid var(--surface-border);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.02), 0 0 2px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      overflow-x: hidden;
      margin: 0; /* Ensure no margin */
      padding: 0; /* Ensure no padding */
    }
    
    .menu-container.compact {
      width: 65px;
    }
    
    .menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid var(--surface-border);
      cursor: pointer;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 5rem;
      color: var(--primary-color);
    }
    
    .logo img {
      height: 80px;
      width: auto;
    }
    
    .menu-footer {
      margin-top: auto;
      padding: 1rem;
      border-top: 1px solid var(--surface-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .avatar {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
    }
    
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #4CAF50;
      border: 2px solid var(--surface-card);
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-color);
    }
    
    .user-role {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }
    
    .logout-icon {
      font-size: 1.2rem;
      color: var(--text-color-secondary);
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .logout-icon:hover {
      color: var(--primary-color);
    }
    
    /* Panel Menu Custom Styles */
    .custom-panel-menu {
      background: transparent;
    }
    
    .custom-panel-menu .p-panelmenu-header-link {
      padding: 0.75rem 1rem;
      transition: all 0.2s;
      border-radius: 8px;
      margin-bottom: 0.25rem;
    }
    
    .custom-panel-menu .p-panelmenu-header-link:focus {
      box-shadow: 0 0 0 2px var(--surface-card), 0 0 0 4px var(--primary-color);
    }
    
    .custom-panel-menu .p-menuitem-icon {
      margin-right: 0.75rem;
      font-size: 1.1rem;
    }
    
    .custom-panel-menu .p-panelmenu-header-link:hover {
      background-color: var(--surface-hover);
    }
    
    .custom-panel-menu .p-panelmenu-header.p-highlight .p-panelmenu-header-link {
      background-color: var(--primary-color);
      color: var(--primary-color-text);
    }
    
    .custom-panel-menu .p-panelmenu-content {
      background-color: transparent;
      border: none;
      padding-left: 1.5rem;
    }
    
    .custom-panel-menu .p-menuitem {
      margin-bottom: 0.25rem;
    }
    
    .custom-panel-menu .p-menuitem-link {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.2s;
    }
    
    .custom-panel-menu .p-menuitem-link:hover {
      background-color: var(--surface-hover);
    }
    
    .custom-panel-menu .p-menuitem-link:focus {
      box-shadow: 0 0 0 2px var(--surface-card), 0 0 0 4px var(--primary-color);
    }
    
    .custom-panel-menu .p-menuitem-active > .p-menuitem-link {
      background-color: var(--primary-color-lighter, rgba(var(--primary-color-rgb), 0.1));
      color: var(--primary-color);
      font-weight: 600;
    }
    
    /* Compact Mode Styles */
    .compact .custom-panel-menu .p-panelmenu-header-text,
    .compact .custom-panel-menu .p-submenu-icon {
      display: none;
    }
    
    .compact .custom-panel-menu .p-panelmenu-header-link {
      justify-content: center;
      padding: 0.75rem;
    }
    
    .compact .custom-panel-menu .p-menuitem-icon {
      margin-right: 0;
      font-size: 1.25rem;
    }
    
    .compact .custom-panel-menu .p-panelmenu-content {
      display: none;
    }
  `]
})
export class PanelMenuComponent {
  public isCompact = false;
  public activeMenu: string | null = null;
  
  public items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Products',
      icon: 'pi pi-tags',
      routerLink: ['/products']
    },
    {
      label: 'Cart',
      icon: 'pi pi-shopping-cart',
      routerLink: ['/cart']
    },
    {
      label: 'Contact Us',
      icon: 'pi pi-envelope',
      routerLink: ['/contact']
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Account',
          icon: 'pi pi-user',
          routerLink: ['/settings/account']
        },
        {
          label: 'Preferences',
          icon: 'pi pi-sliders-h',
          routerLink: ['/settings/preferences']
        }
      ]
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-cart',
      routerLink: ['/cart']
    },
    {
      label: 'Customers',
      icon: 'pi pi-users',
      routerLink: ['/customers']
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-bar',
      routerLink: ['/analytics']
    },
    {
      label: 'Help & Support',
      icon: 'pi pi-question-circle',
      routerLink: ['/support']
    }
  ];

  constructor(private router: Router) {
    // Track active route to highlight current menu item
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveMenu();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Auto-compact on small screens
    this.isCompact = window.innerWidth < 768;
  }

  ngOnInit(): void {
    // Set initial compact state based on screen size
    this.isCompact = window.innerWidth < 768;
    this.updateActiveMenu();
  }

  toggleCompactMode(): void {
    this.isCompact = !this.isCompact;
  }

  updateActiveMenu(): void {
    const currentUrl = this.router.url;
    
    // This is a simplified approach - you might need more complex logic
    // to handle nested routes and parameters
    this.items.forEach(item => {
      if (item.routerLink && this.router.url.startsWith(item.routerLink[0])) {
        item.expanded = true;
      }
      
      if (item.items) {
        item.items.forEach(subItem => {
          if (subItem.routerLink && this.router.url.startsWith(subItem.routerLink[0])) {
            item.expanded = true;
          }
        });
      }
    });
  }

  logout(): void {
    // Implement your logout logic here
    console.log('Logging out...');
    // this.authService.logout();
    // this.router.navigate(['/login']);
  }
}