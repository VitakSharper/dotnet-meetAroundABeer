import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './_services/auth.service';
import {Subscription} from 'rxjs';
import {UsersService} from './_services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscriptionUser: Subscription;
  isLogged = !!localStorage.getItem('token');

  constructor(
    private auth: AuthService,
    private usersService: UsersService) {
    this.unsubscriptionUser = this.usersService.getCurrentUser()
      .subscribe(user => this.usersService.pushUser(user));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.unsubscriptionUser) {
      this.unsubscriptionUser.unsubscribe();
    }
  }
}
