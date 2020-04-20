import {Component, OnInit} from '@angular/core';
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
export class MemberPhotoUploadComponent implements OnInit {
  unsubscribeUser: Subscription;
  currentUser: User;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
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
      .subscribe(user => this.currentUser = user);

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.currentUser.photos.push(JSON.parse(response));
        this.usersService.getCurrentUserSub.next(this.currentUser);
        this.alertify.successAlert('Images successfully uploaded.');
      }
      this.alertify.errorAlert('Problem upload photos.');
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public getName(element) {
    console.log(element);
    return element;
  }
}
