import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PhotosService} from '../../_services/photos.service';

@Component({
  selector: 'app-upload-local-files',
  templateUrl: './upload-local-files.component.html',
  styleUrls: ['./upload-local-files.component.scss']
})
export class UploadLocalFilesComponent implements OnInit {
  uploadForm: FormGroup;
  formData: FormData = new FormData();

  constructor(
    private fb: FormBuilder,
    private photosService: PhotosService) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.uploadForm = this.fb.group({
      single: [undefined],
      multiple: [undefined],
    });
  }

  onUpload() {
    if (this.uploadForm.value.multiple?._files.length > 0) {
      this.transformUpload(this.uploadForm.value.multiple);
      this.photosService.uploadMultiple(this.formData);
      this.formData = new FormData();
    }
    if (this.uploadForm.value.single?._files.length > 0) {
      this.transformUpload(this.uploadForm.value.single);
      this.photosService.uploadSingle(this.formData);
      this.formData = new FormData();
    }
  }

  transformUpload(type: any) {
    type._files.forEach(f => {
      this.formData.append('file', f, f.name);
    });
    this.uploadForm.reset();
  }
}
