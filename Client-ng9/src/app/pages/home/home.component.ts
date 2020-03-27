import {Component, OnInit} from '@angular/core';
import {AlertifyService} from '../../services/alertify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  get onLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  constructor(private alertify: AlertifyService) {
    if (!this.onLoggedIn) {
      setTimeout(() => {

        this.alertify.warningAlert('Please log in or sign up.');
      }, 3000);
    }
  }

  ngOnInit(): void {
  }


}
