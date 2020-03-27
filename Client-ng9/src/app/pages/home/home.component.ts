import {Component, OnInit} from '@angular/core';
import {AlertifyService} from '../../services/alertify.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  get onLoggedIn(): boolean {
    return this.auth.loggedIn();
  }

  constructor(
    private alertify: AlertifyService,
    private auth: AuthService
  ) {
    if (!this.onLoggedIn) {
      setTimeout(() => {
        this.alertify.warningAlert('Please log in or sign up.');
      }, 3000);
    }
  }

  ngOnInit(): void {
  }


}
