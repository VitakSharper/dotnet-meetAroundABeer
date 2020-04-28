import {FormGroup} from '@angular/forms';

export class CustomValidatorsComponent {
  static passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : g.get('confirmPassword').setErrors({'mismatch': true});
  }
}
