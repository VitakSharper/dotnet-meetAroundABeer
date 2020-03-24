import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
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
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(next => {
      console.log('Logged in: ');
    }, error => console.log(error));
  }
}
