import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';

import { User } from "src/app/models/user.model";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  public user: User = null;
  public obj: any = {
    token:"",
    user:{}
  };

  constructor(public _httpService: HttpService) {}

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  signIn(): void{
    this._httpService.signIn(this.user).subscribe((obj: any) => {
      this.obj = obj;
      if(obj.user){
        this.router.navigateByUrl("/dashboard");
      }
    });
  }

}
