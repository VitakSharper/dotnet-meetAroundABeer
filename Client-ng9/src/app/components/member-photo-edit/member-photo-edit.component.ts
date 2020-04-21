import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../../_services/users.service';
import {User} from '../../_services/interfaces';
import {PhotosService} from '../../_services/photos.service';
import {AlertifyService} from '../../_services/alertify.service';

@Component({
  selector: 'app-member-photo-edit',
  templateUrl: './member-photo-edit.component.html',
  styleUrls: ['./member-photo-edit.component.scss']
})
export class MemberPhotoEditComponent implements OnInit, OnDestroy {
  unsubscribeCurrentUser: Subscription;
  user: User;

  constructor(
    private usersService: UsersService,
    private photosService: PhotosService,
    private alertifyService: AlertifyService) {
  }

  ngOnInit(): void {
    this.unsubscribeCurrentUser = this.usersService.getCurrentUserSub
      .subscribe(currentUser => {
        this.user = currentUser;
      });
  }

  setMain(id: string) {
    this.photosService.setMain(id).subscribe();
    this.user.photos.forEach(p => {
      if (p.isMain) {
        p.isMain = false;
      }
      if (p.id === id) {
        p.isMain = true;
        this.user.photoUrl = p.url;
      }
    });
    this.usersService.getCurrentUserSub.next(this.user);
    this.alertifyService.successAlert('Photo successfully set to main.');
  }

  setStatus(id: string) {
    this.photosService.setStatus(id).subscribe();
    this.user.photos.forEach(p => {
      if (p.id === id) {
        p.status = !p.status;
      }
    });
    this.usersService.getCurrentUserSub.next(this.user);
    this.alertifyService.successAlert('Status successfully changed.');
  }

  ngOnDestroy(): void {
    if (this.unsubscribeCurrentUser) {
      this.unsubscribeCurrentUser.unsubscribe();
    }
  }
}
