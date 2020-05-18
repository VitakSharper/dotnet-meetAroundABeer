import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertifyService} from '../../_services/alertify.service';
import {AuthService} from '../../_services/auth.service';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLogged = false;
  private isLoggedSubscriber: Subscription;

  constructor(
    private alertify: AlertifyService,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedSubscriber = this.auth.getIsLoggedOutput
      .subscribe(predicate => {
        this.isLogged = predicate;
        if (!predicate) {
          setTimeout(() => {
            this.alertify.warningAlert('Please log in or sign up.');
          }, 3000);
        }
      });
    this.auth.pushIsLoggedInput();
  }

  ngOnDestroy(): void {
    if (this.isLoggedSubscriber) {
      this.isLoggedSubscriber.unsubscribe();
    }
  }
}
