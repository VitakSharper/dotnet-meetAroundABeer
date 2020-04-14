import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {AlertifyService} from '../../_services/alertify.service';
import {Router} from '@angular/router';
import {UsersService} from '../../_services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private alertify: AlertifyService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ['jasmine@dot.net', [Validators.required, Validators.email]],
      password: ['96a@Ks5@Q', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogIn() {
    this.authService.login(this.loginForm.value)
      .subscribe(next => {
          this.alertify.successAlert('Logged in successfully.');
        }, error => this.alertify.errorAlert(error),
        () => {
          this.router.navigate(['/members']);
        });
  }
}
