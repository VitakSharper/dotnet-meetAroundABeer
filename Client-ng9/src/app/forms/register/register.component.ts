import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidatorsComponent} from '../custom-validators.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  reactForm: FormGroup;

  constructor(
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.reactForm = this.fb.group({
      gender: [null, Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      //dateOfBirth: [null,Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: CustomValidatorsComponent.passwordMatchValidator});
  }

  onRegister() {
    if (!this.reactForm.valid) {
      return;
    }

  }

  onCancel() {
    this.reactForm.reset();
  }
}
