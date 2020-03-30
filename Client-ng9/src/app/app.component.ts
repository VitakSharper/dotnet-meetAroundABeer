import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscription: Subscription;
  isLogged = false;


  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    this.unsubscription = this.auth.getDecToken.subscribe(resp => {
      this.isLogged = resp && !!resp.nameid;
    });
  }

  ngOnDestroy(): void {
    this.unsubscription.unsubscribe();
  }


}
