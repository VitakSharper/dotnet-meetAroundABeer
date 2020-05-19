import {Component, OnInit} from '@angular/core';
import {RequestQueryUserParams, User} from '../../_services/interfaces';
import {Pagination} from '../../_pagination/paginationModel';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {PaginationResult} from '../../_pagination/paginationResult';
import {PageEvent} from '@angular/material/paginator';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  users: User[];
  user: User;
  unsubscribeRemLikeId: Subscription;

  likeParams = 'Likees';

  pagination: Pagination;
  pageSizeOptions = [5, 10, 15, 20];

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
  }

  loadUsers(userParams: RequestQueryUserParams) {
    this.usersService.getUsers(userParams)
      .pipe(
        map(resp => ({...resp, result: resp.result.map(u => ({...u, like: userParams.like === 'Likers' ? null : userParams.like}))})
        )
      )
      .subscribe((res: PaginationResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.errorAlert(error);
      });
  }

  mdPageChanged($event: PageEvent) {
    this.pagination.currentPage = $event.pageIndex + 1;
    if (!!$event.pageSize) {
      this.pagination.itemsPerPage = $event.pageSize;
    }
    this.loadUsers(
      this.setUserParams(
        null,
        null,
        null,
        null,
        this.likeParams));
  }

  setUserParams(
    minAge?: number,
    maxAge?: number,
    gender?: string,
    orderBy?: string,
    like?: string
  ): RequestQueryUserParams {
    return {
      gender: gender,
      itemsPerPage: this.pagination.itemsPerPage || 5,
      page: this.pagination.currentPage || 1,
      maxAge: maxAge || 99,
      minAge: minAge || 18,
      orderBy: orderBy || '',
      like: like
    };
  }

  onShowMembers(likeParams: string) {
    this.initPagination();
    this.likeParams = likeParams;
    this.loadUsers(this.setUserParams(null, null, null, null, likeParams));
  }

  initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
  }

  public removeLike(userId: string) {
    this.usersService.removeLike(userId)
      .subscribe(() => {
        }, error =>
          this.alertify.errorAlert(`${error}`),
        () => {
          {
            this.users.splice(this.users.findIndex(u => u.id === userId), 1);
            //this.users = this.users.filter(u => u.id !== userId);
            this.pagination.totalItems--;
            this.alertify.successAlert(`Successfully removed`);
          }
        }
      );
  }
}
