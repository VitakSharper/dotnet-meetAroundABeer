import {Component, OnInit} from '@angular/core';
import {User} from '../../services/interfaces';
import {UsersService} from '../../services/users.service';
import {AlertifyService} from '../../services/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  users: User[];

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    }, error => this.alertify.errorAlert(error));
  }

}
