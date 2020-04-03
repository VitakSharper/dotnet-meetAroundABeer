import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {LogUser, RegUser, User} from './interfaces';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  jwtHelper = new JwtHelperService();
  protected decToken: BehaviorSubject<any> = new BehaviorSubject<any>(this.loadToken);
  baseUrl = `${environment.apiUrl}/auth`;

  get loadToken() {
    return localStorage.getItem('token') && this.jwtHelper.decodeToken(localStorage.getItem('token'));
  }

  public get getDecToken() {
    return this.decToken;
  }

  constructor(private http: HttpClient) {
  }

  login(model: LogUser): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, model)
      .pipe(
        map((resp: any) => {
          if (resp) {
            localStorage.setItem('token', resp.token);
            this.decToken.next(this.jwtHelper.decodeToken(resp.token));
          }
        })
      );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(user: RegUser): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
}
