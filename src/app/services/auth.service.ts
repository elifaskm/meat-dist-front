import {Injectable, computed, inject, signal} from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError} from 'rxjs';
import { User, AuthStatus, LoginResponse, CheckTokenResponse} from '../models';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private readonly baseUrl: string = environment.BASE_API_URL;
  private http =  inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //público
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean{
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    localStorage.setItem('uname', user.username);

    return true;
  }

  login(user: string, password:string): Observable<boolean>{
    const url = `${this.baseUrl}/auth/signIn`;
    const body = {username:user, password:password};

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map( ({ user, token }) => this.setAuthentication(user, token)),
      catchError( err => throwError( () => err.error.message ))
    )
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${ this.baseUrl }/auth/checktoken`;
    const token = localStorage.getItem('token');
    const uname = localStorage.getItem('uname');

    if(!token){
      this.logout();
      return of(false);
    }

    const body = {
      "id": 0,
      "username": uname,
      "name": "",
      "description": "",
      "status": ""
    };

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http.post<CheckTokenResponse>(url, body, {headers}, )
    .pipe(
      map( ({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('uname');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

}
