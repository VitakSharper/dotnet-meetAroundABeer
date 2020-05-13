import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';
import {share} from 'rxjs/operators';

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
    this.subscriptionUser = this.usersService.getCurrentUserSub.pipe(share())
      .subscribe(user => {
        console.log(user);
        this.user = user;
      });

  }

  ngOnDestroy(): void {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
  }
}
