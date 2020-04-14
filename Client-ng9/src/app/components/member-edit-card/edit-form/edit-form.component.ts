import {AfterContentChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../_services/interfaces';
import {UsersService} from '../../../_services/users.service';
import {Subscription} from 'rxjs';
import {TabsService} from '../../../_services/tabs.service';
import {AlertifyService} from '../../../_services/alertify.service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription;
  unsubscribeWarning: Subscription;
  updateForm: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private tabsService: TabsService,
    private alertifyService: AlertifyService
  ) {
  }

  ngOnInit(): void {
    this.unsubscribe = this.usersService.getCurrentUserSub
      .subscribe(
        data => this.user = data);

    this.createUpdateForm();

    this.unsubscribeWarning = this.updateForm.valueChanges
      .subscribe(val => {
        this.tabsService.getEditWarning.next(this.updateForm.dirty);
      });
  }

  private createUpdateForm() {
    this.updateForm = this.fb.group({
      introduction: [this.user.introduction, Validators.required],
      lookingFor: [this.user.lookingFor, Validators.required],
      interests: [this.user.interests],
      city: [this.user.city, Validators.required],
      country: [this.user.country, Validators.required]
    });
  }

  updateUser() {
    Object.entries(this.updateForm.value).forEach(value => {
      this.user[value[0]] = value[1];
    });
    this.usersService.updateUser(this.user)
      .subscribe(resp => console.log(resp));
    this.alertifyService.successAlert('Updated successfully');
    this.updateForm.reset(this.user);
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
    this.unsubscribeWarning.unsubscribe();
  }
}
