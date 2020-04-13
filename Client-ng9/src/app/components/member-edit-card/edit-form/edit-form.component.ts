import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../services/interfaces';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription;
  updateForm: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {

    this.unsubscribe = this.usersService.getCurrentUserSub.subscribe(
      data => {
        this.user = data;
        // this.updateForm.setValue({
        //   introduction: this.user.introduction,
        //   lookingFor: this.user.lookingFor,
        //   interests: this.user.interests
        // });
      }
    );
    this.createUpdateForm();
    console.log('user: ', this.user);

  }

  private createUpdateForm() {
    this.updateForm = this.fb.group({
      introduction: [this.user.introduction, Validators.required],
      lookingFor: [this.user.lookingFor, Validators.required],
      interests: [this.user.interests, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  updateUser() {

  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }
}
