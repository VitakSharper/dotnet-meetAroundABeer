import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './_services/auth.service';
import {Observable, Subscription} from 'rxjs';
import {UsersService} from './_services/users.service';
import {share} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscriptionUser: Subscription;
  isLogged = false;
  private isLoggedSubscriber: Subscription;

  constructor(
    private auth: AuthService,
    private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.unsubscriptionUser = this.usersService.getCurrentUser().pipe(share())
      .subscribe(user => this.usersService.pushUser(user));

    this.isLoggedSubscriber = this.auth.getIsLoggedOutput.subscribe(predicate => {
      this.isLogged = predicate;
    });
    this.auth.pushIsLoggedInput();
  }

  ngOnDestroy(): void {
    if (this.unsubscriptionUser) {
      this.unsubscriptionUser.unsubscribe();
    }
    if (this.isLoggedSubscriber) {
      this.isLoggedSubscriber.unsubscribe();
    }
  }
}
