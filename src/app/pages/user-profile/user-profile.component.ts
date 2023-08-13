import { Component, Input, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { User } from "src/app/models/user.model";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
 // @Input() user: any = {};
 public user: User;

  constructor(public _httpService: HttpService) { }

  ngOnInit() {
    this._httpService.getUser("test").subscribe((user: User) => {
      this.user = user;
    })
  }

}
