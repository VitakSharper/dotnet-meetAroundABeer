import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {

  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.createUpdateForm();
  }

  private createUpdateForm() {
    this.updateForm = this.fb.group({
      introduction: ['', Validators.required],
      lookingFor: ['', Validators.required],
      interests: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  updateUser() {

  }
}
