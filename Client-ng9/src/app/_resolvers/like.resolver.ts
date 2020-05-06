import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {User} from '../_services/interfaces';
import {Observable, of} from 'rxjs';
import {UsersService} from '../_services/users.service';
import {AlertifyService} from '../_services/alertify.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class LikeResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  likesParam = 'Likees';

  constructor(
    private userService: UsersService,
    private router: Router,
    private alertify: AlertifyService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userService.getUsers({
      page: this.pageNumber,
      itemsPerPage: this.pageSize,
      like: this.likesParam
    })
      .pipe(
        map(resp => ({...resp, result: resp.result.map(u => ({...u, like: 'Likees'}))})
        )
      )
      .pipe(
        catchError(err => {
          this.alertify.errorAlert('Problem retrieving data.');
          this.router.navigate(['/']);
          return of(null); // return type of observable
        })
      );
  }
}
