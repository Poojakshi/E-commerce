// change-password.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
 // Update this path

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  // currentPassword: string = '';
  // newPassword: string = '';
  currentPasswordValue: string = '';
  newPasswordValue: string = '';
  confirmPassword: string = '';
  error: string = '';
  successMessage: string = '';
  fauth: any;

  constructor(private as: AuthService, private router: Router) {}

// Inject the Router service in your component

// async changePassword(currentPassword: string, newPassword: string): Promise<void> {
//   try {
//     if (!newPassword || newPassword.trim() === '') {
//       throw new Error('New password cannot be empty.');
//     }

//     // Proceed with the password change process
//     await this.as.changePassword(currentPassword, newPassword);

//     // Password change was successful
//     this.successMessage = 'Password changed successfully!';

//     // Navigate to the login page
//     this.router.navigate(['/login']); // Replace '/login' with your actual login route
//   } catch (error) {
//     console.error('Error changing password:', error);
//     // Handle the error appropriately, display an error message, etc.
//   }
// }
async changePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    if (!newPassword || newPassword.trim() === '') {
      throw new Error('New password cannot be empty.');
    }

    // Proceed with the password change process
    await this.as.changePassword(currentPassword, newPassword);

    // Password change was successful
    this.successMessage = 'Password changed successfully!';

    // Logout the user
    await this.as.logout();

    // Navigate to the login page
    this.router.navigate(['/login']); // Replace '/login' with your actual login route
  } catch (error) {
    console.error('Error changing password:', error);
    // Handle the error appropriately, display an error message, etc.
  }
}

  clearFields(): void {
    this.currentPasswordValue = '';
    this.newPasswordValue = '';
    this.confirmPassword = '';
  }
}
