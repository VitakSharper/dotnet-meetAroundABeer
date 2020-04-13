import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../services/interfaces';
import {UsersService} from '../../services/users.service';
import {AlertifyService} from '../../services/alertify.service';
import {ActivatedRoute} from '@angular/router';
import {MatTabGroup} from '@angular/material/tabs';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})

export class MemberDetailComponent implements OnInit {
  user: User;


  constructor(
    private userService: UsersService,
    private alertity: AlertifyService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }


}
