import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ActivatedRoute} from '@angular/router';
import {Pagination} from '../../_pagination/paginationModel';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {PaginationResult} from '../../_pagination/paginationResult';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  pagination: Pagination;
  users: User[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageSizeOptions = [5, 10, 20];

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
  }

  loadUsers() {
    this.usersService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
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
    this.loadUsers();
  }
}
