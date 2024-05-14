import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAccessService } from '../../services/user-access.service';

@Component({
  selector: 'app-promote-user-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './promote-user-admin.component.html',
  styleUrl: './promote-user-admin.component.css'
})
export class PromoteUserAdminComponent {

  email: string = "";
  errorMessage: string = "";
  successMessage: string = "";
  openingHour: number = 0; // Initialize 'openingHour' property
  closingHour: number = 0;

  constructor(private userAccessService: UserAccessService){}

  promoteUser() {
    this.errorMessage = "";
    this.successMessage = "";
    if(this.email == ""){
      this.errorMessage = "Please enter the email";
      return;
    }
    this.userAccessService.promoteToAdmin(this.email)
    .subscribe({
      next: (result: any) => {
        console.log({ result });
        this.successMessage = result.message;
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = error;
      }
    });
  }

  confirmHoursChange() {
    // Assuming an endpoint or a method in your service to update hours
    // This example assumes you're using a hypothetical method `updateWorkingHours`
   
  }
}
