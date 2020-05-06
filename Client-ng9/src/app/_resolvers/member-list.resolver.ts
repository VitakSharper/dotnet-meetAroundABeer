import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {User} from '../_services/interfaces';
import {Observable, of, Subscription} from 'rxjs';
import {UsersService} from '../_services/users.service';
import {AlertifyService} from '../_services/alertify.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]>, OnDestroy {
  pageNumber = 1;
  pageSize = 5;
  user: User;
  unsubscribeUser: Subscription;

  constructor(
    private userService: UsersService,
    private router: Router,
    private alertify: AlertifyService
  ) {
    this.unsubscribeUser = this.userService.getCurrentUserSub
      .subscribe(user => this.user = user);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userService.getUsers({
      page: this.pageNumber,
      itemsPerPage: this.pageSize,
      gender: this.user.gender === 'male' ? 'female' : 'male'
    }).pipe(
      catchError(err => {
        this.alertify.errorAlert('Problem retrieving data.');
        this.router.navigate(['/']);
        return of(null); // return type of observable
      })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeUser.unsubscribe();
  }
}
