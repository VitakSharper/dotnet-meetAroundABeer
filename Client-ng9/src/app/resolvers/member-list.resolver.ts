import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {User} from '../services/interfaces';
import {Observable, of} from 'rxjs';
import {UsersService} from '../services/users.service';
import {AlertifyService} from '../services/alertify.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {

  constructor(
    private userService: UsersService,
    private router: Router,
    private alertify: AlertifyService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userService.getUsers().pipe(
      catchError(err => {
        this.alertify.errorAlert('Problem retrieving data.');
        this.router.navigate(['/']);
        return of(null); // return type of observable
      })
    );
  }
}