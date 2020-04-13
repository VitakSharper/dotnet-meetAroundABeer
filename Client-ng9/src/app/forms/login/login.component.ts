import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {AlertifyService} from '../../services/alertify.service';
import {Router} from '@angular/router';
import {UsersService} from '../../services/users.service';
import {Subscription} from 'rxjs';

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogIn() {
    this.authService.login(this.loginForm.value)
      .subscribe(next => {
          this.alertify.successAlert('Logged in successfully.');
          this.usersService.getCurrentUser().subscribe(data => {
            this.usersService.getCurrentUserSub.next(data.userToReturn);
          });
        }, error => this.alertify.errorAlert(error),
        () => {
          this.router.navigate(['/members']);
        });
  }
}
