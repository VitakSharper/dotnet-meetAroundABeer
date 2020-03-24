import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  get onLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
  }
}
