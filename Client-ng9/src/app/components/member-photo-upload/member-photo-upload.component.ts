import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {AlertifyService} from '../../_services/alertify.service';
import {Subscription} from 'rxjs';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';

@Component({
  selector: 'app-member-photo-upload',
  templateUrl: './member-photo-upload.component.html',
  styleUrls: ['./member-photo-upload.component.scss']
})
export class MemberPhotoUploadComponent implements OnInit, OnDestroy {
  unsubscribeUser: Subscription;
  currentUser: User;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor(
    private alertify: AlertifyService,
    private usersService: UsersService
  ) {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/photos/photo`,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
  }

  ngOnInit(): void {
    this.unsubscribeUser = this.usersService.getCurrentUserSub
      .subscribe(user => {
        this.currentUser = user;
      });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.currentUser.photos.push(JSON.parse(response));
        if (this.currentUser.photoUrl === null || this.currentUser.photoUrl === '/assets/original.png') {
          this.currentUser.photoUrl = JSON.parse(response).url;
        }
        this.usersService.pushUser(this.currentUser);
        this.alertify.successAlert('Images successfully uploaded.');
      }
      this.alertify.errorAlert('Problem upload photos.');
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnDestroy(): void {
    this.unsubscribeUser.unsubscribe();
  }
}
