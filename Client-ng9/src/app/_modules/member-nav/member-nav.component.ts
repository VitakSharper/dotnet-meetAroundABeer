import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';
import {share} from 'rxjs/operators';

@Component({
  selector: 'app-member-nav',
  templateUrl: './member-nav.component.html',
  styleUrls: ['./member-nav.component.scss']
})
export class MemberNavComponent implements OnInit {
  subscriptionUser: Subscription;
  user: User;

  constructor(
    private usersService: UsersService) {

  }

  ngOnInit(): void {
    this.subscriptionUser = this.usersService.getCurrentUserSub.pipe(share())
      .subscribe(user => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
  }
}
