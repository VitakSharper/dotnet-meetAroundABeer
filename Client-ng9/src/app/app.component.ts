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
  unsubscriptionToken: Subscription;
  unsubscriptionUser: Subscription;
  isLogged = false;


  constructor(
    private auth: AuthService,
    private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.unsubscriptionToken = this.auth.getDecToken.subscribe(resp => {
      this.isLogged = resp && !!resp.nameid;
    });

    this.unsubscriptionUser = this.usersService.getCurrentUser()
      .subscribe(user => this.usersService.pushUser(user));
  }

  ngOnDestroy(): void {
    if (this.unsubscriptionUser) {
      this.unsubscriptionUser.unsubscribe();
    }
    if (this.unsubscriptionToken) {
      this.unsubscriptionToken.unsubscribe();
    }
  }
}
