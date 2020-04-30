import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidatorsComponent} from '../custom-validators.component';
import {AuthService} from '../../_services/auth.service';
import {AlertifyService} from '../../_services/alertify.service';
import {UsersService} from '../../_services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  reactForm: FormGroup;
  errors = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alertify: AlertifyService,
    private usersService: UsersService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.reactForm = this.fb.group({
      gender: ['male', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      dateOfBirth: [undefined, Validators.required],
      city: ['Paris', Validators.required],
      country: ['France', Validators.required],
      password: ['HY934hniB*', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirmPassword: ['HY934hniB*', Validators.required]
    }, {validator: CustomValidatorsComponent.passwordMatchValidator});
  }

  onRegister() {
    if (!this.reactForm.valid) {
      return;
    }

    this.auth.register(this.reactForm.value).subscribe((resp: any) => {
      if (resp) {
        localStorage.setItem('token', resp.token);
        this.usersService.getCurrentUserSub.next(resp.userToReturn);
        this.auth.getDecToken.next(this.auth.jwtHelper.decodeToken(resp.token));
      }
    }, error => {
      this.errors = error;
      this.alertify.errorAlert('Problem register user.');
    }, () => {
      this.router.navigate(['/members']);
    });
  }

  onCancel() {
    this.reactForm.reset();
    this.errors = [];
  }
}
