import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {AlertifyService} from '../../services/alertify.service';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  unsubscription: Subscription;
  displayName: string;

  get onLoggedIn(): boolean {
    return this.auth.loggedIn();
  }

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private alertify: AlertifyService,
    private auth: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      'beer',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/beer.svg')
    );
  }

  ngOnInit(): void {
    this.unsubscription = this.auth.getDecToken.subscribe(resp => {
      this.displayName = resp && resp.nameid;
    });

    this.usersService.getCurrentUser().subscribe(data => this.usersService.getCurrentUserSub.next(data.userToReturn));

  }

  logOut() {
    localStorage.removeItem('token');
    this.auth.getDecToken.next('');
    setTimeout(() => {
      this.alertify.warningAlert('Logged Out.');
    }, 500);
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.unsubscription.unsubscribe();
  }

  onEditProfile() {
    this.router.navigate(['/profile']);
  }
}
