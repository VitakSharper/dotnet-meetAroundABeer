import {Component, OnInit} from '@angular/core';
import {AlertifyService} from '../../_services/alertify.service';
import {AuthService} from '../../_services/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  onLoggedIn: Observable<boolean>;

  constructor(
    private alertify: AlertifyService,
    private auth: AuthService
  ) {
    this.onLoggedIn = auth.getIsLoggedOutput;
  }

  ngOnInit(): void {
    this.onLoggedIn.subscribe(isLogged => {
      if (!isLogged) {
        setTimeout(() => {
          this.alertify.warningAlert('Please log in or sign up.');
        }, 3000);
      }
    });
  }
}
