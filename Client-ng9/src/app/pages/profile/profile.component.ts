import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../services/interfaces';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TabsService} from '../../services/tabs.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @Output() user: User;
  unsubscribeWarning: Subscription;
  showWarning = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private tabsService: TabsService
  ) {
  }

  ngOnInit(): void {
    this.tabsService.getEditWarning.next(false);

    this.route.data.subscribe(data => {
      this.user = data['user'].userToReturn;
      this.usersService.getCurrentUserSub.next(data['user'].userToReturn);
    });
    this.unsubscribeWarning = this.tabsService.getEditWarning
      .subscribe(data => this.showWarning = data);
  }

  ngOnDestroy(): void {
    this.unsubscribeWarning.unsubscribe();
  }

}
