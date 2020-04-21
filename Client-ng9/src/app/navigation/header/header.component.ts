import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {AlertifyService} from '../../_services/alertify.service';
import {AuthService} from '../../_services/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {UsersService} from '../../_services/users.service';
import {User} from '../../_services/interfaces';
import {TabsService} from '../../_services/tabs.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  unsubscriptionToken: Subscription;
  unsubscriptionUser: Subscription;
  user: User;
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
    private router: Router,
    private tabsService: TabsService
  ) {
    this.matIconRegistry.addSvgIcon(
      'beer',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/beer.svg')
    );
  }

  ngOnInit(): void {
    this.unsubscriptionToken = this.auth.getDecToken
      .subscribe(resp => {
        this.displayName = resp && resp.nameid;
      });

    this.unsubscriptionUser = this.usersService.getCurrentUserSub
      .subscribe(user => {
        this.user = this.usersService.getUserWithPhoto(user);
      });
  }

  logOut() {
    localStorage.removeItem('token');
    this.auth.getDecToken.next('');
    setTimeout(() => {
      this.alertify.warningAlert('Logged Out.');
    }, 500);
    this.usersService.pushUser(null);
    this.router.navigate(['/']);
  }

  onEditProfile() {
    this.router.navigate(['/profile']);
  }

  onEditProfilesPhoto() {
    this.router.navigate(['/profile']);
    this.tabsService.getTabIndex.next(1);

  }

  ngOnDestroy(): void {
    if (this.unsubscriptionToken) {
      this.unsubscriptionToken.unsubscribe();
    }
    if (this.unsubscriptionUser) {
      this.unsubscriptionUser.unsubscribe();
    }
  }
}
