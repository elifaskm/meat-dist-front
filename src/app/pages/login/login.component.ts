import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { AuthService } from '../../services/auth.service';
import { User } from "src/app/models/user.model";
import { Router } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);

  public user: User = {
    id: 0,
    username: "",
    name: "",
    description: "",
    status: "",
    password: ""
  };
  public obj: any = {
    token:"",
    user:{}
  };

  constructor(public _httpService: HttpService, public _authService: AuthService) {}

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  signIn(): void{
    this._authService.login(this.user.username, this.user.password)
    .subscribe({
      next: () => this.router.navigateByUrl("/dashboard"),
      error: (message) => {
        Swal.fire('Error', message);
      }
    });
    // .subscribe((obj: any) => {
    //   this.obj = obj;
    //   if(obj.user){
    //     this.router.navigateByUrl("/dashboard");
    //   }
    // });
  }

}
