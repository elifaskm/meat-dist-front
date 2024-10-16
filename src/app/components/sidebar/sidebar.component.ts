import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/inputs_outputs', title: 'Entradas y Salidas de Almacen',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/product_sent', title: 'Productos Enviados a Sucursal',  icon:'ni-send text-yellow', class: '' },
    { path: '/branch-cash-control', title: 'Control de Inventario en Sucursales',  icon:'ni-money-coins text-green', class: '' },
    { path: '/reportes', title: 'Reportes',  icon:'ni-archive-2 text-info', class: '' },
    { path: '/catalogs', title: 'Catálogos',  icon:'ni-collection text-warning', class: '' },
    { path: '/configuration', title: 'Configuración',  icon:'ni-settings text-default', class: '' },
    { path: '/restart-db', title: 'Reiniciar Base de Datos',  icon:'ni-curved-next text-warning', class: '' },
    //{ path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
    //{ path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
    //{ path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
    //{ path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
    //{ path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
    //{ path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
