import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, share} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs';
import {LogUser, User} from './interfaces';
import {environment} from '../../environments/environment';
import {UsersService} from './users.service';
import {AlertifyService} from './alertify.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  jwtHelper: JwtHelperService;
  baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private alertifyService: AlertifyService,
    private router: Router
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  login(model: LogUser) {
    this.http.post(`${this.baseUrl}/login`, model)
      .pipe(
        share(),
        map((resp: LogUser) => {
          if (resp) {
            localStorage.setItem('token', resp.token);
            this.usersService.getCurrentUserSub.next(this.usersService.getUserWithPhoto(resp.user));
          }
        })
      ).subscribe(() => {
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
    return this.http.post(`${this.baseUrl}/register`, user).pipe(
      share(),
      map((resp: LogUser) => {
        if (resp) {
          localStorage.setItem('token', resp.token);
          this.usersService.getCurrentUserSub.next(this.usersService.getUserWithPhoto(resp.user));
        }
      }));
  }
}
