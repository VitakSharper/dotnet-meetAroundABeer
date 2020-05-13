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
import {share} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  unsubscriptionUser: Subscription;
  user: User;

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
    this.unsubscriptionUser = this.usersService.getCurrentUserSub.pipe(share())
      .subscribe(user => {
        this.user = this.usersService.getUserWithPhoto(user);
      });
  }

  logOut() {
    localStorage.removeItem('token');
    setTimeout(() => {
      this.alertify.warningAlert('Logged Out.');
    }, 500);
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
    if (this.unsubscriptionUser) {
      this.unsubscriptionUser.unsubscribe();
    }
  }
}
