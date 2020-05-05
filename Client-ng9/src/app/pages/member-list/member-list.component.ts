import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RequestQueryUserParams, User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ActivatedRoute} from '@angular/router';
import {Pagination} from '../../_pagination/paginationModel';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {PaginationResult} from '../../_pagination/paginationResult';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  pagination: Pagination;
  users: User[];
  user: User;
  unsubscribeUser: Subscription;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageSizeOptions = [5, 10, 15, 20];

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.unsubscribeUser = this.usersService.getCurrentUserSub.subscribe(user => {
      this.user = user;
    });
    this.createForm();
  }

  private createForm() {
    this.filterForm = this.fb.group({
      minAge: [null, [Validators.required]],
      maxAge: [null, [Validators.required]],
      gender: ['male', [Validators.required]]
    });
  }

  loadUsers(userParams: RequestQueryUserParams) {
    this.usersService.getUsers(userParams)
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
    this.loadUsers(this.setUserParams());
  }

  onFormSubmit() {
    this.initPagination();
    this.loadUsers(this.setUserParams(
      this.filterForm.get('minAge').value,
      this.filterForm.get('maxAge').value,
      this.filterForm.get('gender').value));
  }

  setUserParams(minAge?: number, maxAge?: number, gender?: string, orderBy?: string): RequestQueryUserParams {
    return {
      gender: gender || this.filterForm.get('gender').value || (this.user.gender === 'male' ? 'female' : 'male'),
      itemsPerPage: this.pagination.itemsPerPage || 5,
      page: this.pagination.currentPage || 1,
      maxAge: maxAge || this.filterForm.get('maxAge').value || 99,
      minAge: minAge || this.filterForm.get('minAge').value || 18,
      orderBy: orderBy || ''
    };
  }

  initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
  }

  resetFilters() {
    this.initPagination();
    this.filterForm.reset();
    this.loadUsers(this.setUserParams());
  }

  orderBy(orderBy: string) {
    switch (orderBy) {
      case 'lastActive':
        this.loadUsers(this.setUserParams(null, null, null, orderBy));
        break;
      case 'created':
        this.loadUsers(this.setUserParams(null, null, null, orderBy));
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeUser.unsubscribe();
  }
}
