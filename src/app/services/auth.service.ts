import {Injectable, inject} from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private readonly baseUrl: string = environment.BASE_API_URL;
  private http =  inject(HttpClient);

  // private _currentUser = signal<User|null>(null);
  // private _authStatus = signal<AuthStatus>();

  constructor() { }

  login(user: string, password:string): Observable<boolean>{
    return of(true);
  }
}
