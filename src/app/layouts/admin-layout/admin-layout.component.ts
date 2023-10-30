import { Component, OnInit, inject, computed } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  private authService = inject( AuthService );

  public user = computed( () => this.authService.currentUser() );

  // get user(){
  //   return this.authService.currentUser();
  // }

  constructor() { }

  ngOnInit() {
  }

}
