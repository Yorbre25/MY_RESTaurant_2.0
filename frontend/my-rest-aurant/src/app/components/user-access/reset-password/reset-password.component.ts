import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserAccessService } from '../../../services/user-access.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  errorMessage: string = "";
  successMessage: string = "";
  constructor(private userAccessService: UserAccessService, private router: Router){}
  
  submitForm() {
    this.errorMessage = "";
    this.successMessage = "";
    if(this.email == ""){
      this.errorMessage = "Missing user email";
      return;
    }
    this.userAccessService.resetPassword(this.email)
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
