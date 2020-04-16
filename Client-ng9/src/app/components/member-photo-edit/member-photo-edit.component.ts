import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../../_services/users.service';
import {User} from '../../_services/interfaces';

@Component({
  selector: 'app-member-photo-edit',
  templateUrl: './member-photo-edit.component.html',
  styleUrls: ['./member-photo-edit.component.scss']
})
export class MemberPhotoEditComponent implements OnInit {
  unsubscribeCurrentUser: Subscription;
  user: User;

  constructor(private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.unsubscribeCurrentUser = this.usersService.getCurrentUserSub
      .subscribe(currentUser => {
        this.user = currentUser;
      });
  }
}
