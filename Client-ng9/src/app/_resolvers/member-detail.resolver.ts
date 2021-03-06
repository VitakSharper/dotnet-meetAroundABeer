import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {User} from '../_services/interfaces';
import {Observable, of} from 'rxjs';
import {UsersService} from '../_services/users.service';
import {AlertifyService} from '../_services/alertify.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {

  constructor(
    private userService: UsersService,
    private router: Router,
    private alertify: AlertifyService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(route.params['id']).pipe(
      catchError(err => {
        this.alertify.errorAlert('Problem retrieving data.');
        this.router.navigate(['/members']);
        return of(null); // return type of observable
      })
    );
  }
}
