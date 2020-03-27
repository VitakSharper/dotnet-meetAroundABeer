import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject} from 'rxjs';

interface RegUser {
  gender: string,
  username: string,
  email: string,
  displayName: string,
  //dateOfBirth: [null,Validators.required],
  city: string,
  country: string,
  password: string,
}

interface LogUser {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  jwtHelper = new JwtHelperService();
  protected decToken: BehaviorSubject<any> = new BehaviorSubject<any>(this.loadToken);
  baseUrl = `http://localhost:5000/api/auth`;

  get loadToken() {
    return localStorage.getItem('token') && this.jwtHelper.decodeToken(localStorage.getItem('token'));
  }

  public get getDecToken() {
    return this.decToken;
  }

  constructor(private http: HttpClient) {
  }

  login(model: LogUser) {
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

  register(user: RegUser) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
}
