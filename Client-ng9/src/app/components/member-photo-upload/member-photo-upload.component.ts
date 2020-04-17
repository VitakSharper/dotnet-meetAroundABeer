import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {AlertifyService} from '../../_services/alertify.service';

@Component({
  selector: 'app-member-photo-upload',
  templateUrl: './member-photo-upload.component.html',
  styleUrls: ['./member-photo-upload.component.scss']
})
export class MemberPhotoUploadComponent implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor(private alertify: AlertifyService) {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/photos/photo`,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
      // disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      // formatDataFunctionIsAsync: true,
      // formatDataFunction: async (item) => {
      //   return new Promise((resolve, reject) => {
      //     resolve({
      //       name: item._file.name,
      //       length: item._file.size,
      //       contentType: item._file.type,
      //       date: new Date()
      //     });
      //   });
      // }
    });
  }

  ngOnInit(): void {
    this.uploader.response.subscribe(res => {
      this.alertify.successAlert('Images successfully uploaded.');
      console.log(res);
    });
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
