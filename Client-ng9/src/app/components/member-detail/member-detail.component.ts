import {Component, OnInit, Output} from '@angular/core';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})

export class MemberDetailComponent implements OnInit {
  @Output() user: User;


  constructor(
    private userService: UsersService,
    private alertity: AlertifyService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.user = this.userService.getUserWithPhoto(data['user']);
    });
  }
}
