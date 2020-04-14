import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {ProfileComponent} from '../pages/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<ProfileComponent> {
  canDeactivate(
    component: ProfileComponent) {
    return component.showWarning
      ? confirm('Are you sure you want to continue? Any unsaved changes will be lost.')
      : true;
  }
}
