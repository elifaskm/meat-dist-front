import { Component, inject, computed, effect } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthStatus } from './models';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'argon-dashboard-angular';

  private router = inject(Router);
  private authService = inject(AuthService);

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking){
      return false;
    }

    return true;
  });

  public authStatusChengedEffect = effect(()=>{
    switch(this.authService.authStatus()){
      case AuthStatus.checking:
        //this.router.navigateByUrl('/dashboard');
        return;
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });

}
