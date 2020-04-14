import {Component, OnInit} from '@angular/core';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  users: User[];

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.users = data['users'];
    });
  }
}
