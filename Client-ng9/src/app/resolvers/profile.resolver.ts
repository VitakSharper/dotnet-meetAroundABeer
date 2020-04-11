import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {User} from '../services/interfaces';
import {UsersService} from '../services/users.service';
import {AlertifyService} from '../services/alertify.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ProfileResolver implements Resolve<User> {

  constructor(
    private userService: UsersService,
    private router: Router,
    private alertify: AlertifyService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.currentUser().pipe(
      catchError(err => {
        this.alertify.errorAlert('Problem retrieving data.');
        this.router.navigate(['/profile']);
        return of(null); // return type of observable
      })
    );
  }
}
