import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './_services/auth.service';
import {Subscription} from 'rxjs';
import {UsersService} from './_services/users.service';
import {share} from 'rxjs/operators';

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

  }

  ngOnInit(): void {
    this.unsubscriptionUser = this.usersService.getCurrentUser().pipe(share())
      .subscribe(user => this.usersService.pushUser(user));
  }

  ngOnDestroy(): void {
    if (this.unsubscriptionUser) {
      this.unsubscriptionUser.unsubscribe();
    }
  }
}
