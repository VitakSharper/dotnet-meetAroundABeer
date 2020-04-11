import {Component, OnInit, Output} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../services/interfaces';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Output() user: User;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.user = data['user'].userToReturn;
    });
  }

}
