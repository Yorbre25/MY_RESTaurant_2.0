import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserAccessService } from '../../services/user-access.service';

@Component({
  selector: 'app-promote-user-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './promote-user-admin.component.html',
  styleUrl: './promote-user-admin.component.css'
})
export class PromoteUserAdminComponent {

  email: string = "";
  errorMessage: string = "";
  successMessage: string = "";

  constructor(private userAccessService: UserAccessService){}

  promoteUser() {
    this.errorMessage = "";
    this.successMessage = "";
    if(this.email == ""){
      this.errorMessage = "Please enter the email"
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
    
}
