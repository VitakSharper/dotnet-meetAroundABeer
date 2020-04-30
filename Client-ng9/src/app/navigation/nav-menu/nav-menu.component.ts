import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  subscriptionUser: Subscription;
  user: User;


  constructor(
    private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.subscriptionUser = this.usersService.getCurrentUserSub
      .subscribe(user => {
        this.user = this.usersService.getUserWithPhoto(user);
      });
  }

  ngOnDestroy(): void {
    this.subscriptionUser.unsubscribe();
  }
}
