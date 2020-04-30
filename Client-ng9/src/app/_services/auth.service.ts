import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {LogUser, RegUser, User} from './interfaces';
import {environment} from '../../environments/environment';
import {UsersService} from './users.service';
import {AlertifyService} from './alertify.service';
import {Router} from '@angular/router';


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

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private alertifyService: AlertifyService,
    private router: Router
  ) {
  }

  insertToken(token: any) {
    this.decToken.next(this.jwtHelper.decodeToken(token));
  }

  login(model: LogUser) {
    this.http.post(`${this.baseUrl}/login`, model)
      .pipe(
        map((resp: any) => {
          if (resp) {
            localStorage.setItem('token', resp.token);
            this.insertToken(resp.token);
            this.usersService.getCurrentUserSub.next(this.usersService.getUserWithPhoto(resp.user));
          }
        })
      ).subscribe(next => {
        this.alertifyService.successAlert('Logged in successfully.');
      }, error => this.alertifyService.errorAlert(error),
      () => {
        this.router.navigate(['/members']);
      });
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
}
