import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserAccessService } from '../../../services/user-access.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  errorMessage: string = '';

  constructor(private userAccessService: UserAccessService, private router: Router){}

  submitForm() {
    this.errorMessage = "";
    if(this.name == ""){
      this.errorMessage = "Missing user name";
      return;
    }
    if(this.email == ""){
      this.errorMessage = "Missing user email";
      return;
    }
    if(this.password == ""){
      this.errorMessage = "Missing user password";
      return;
    }
    this.userAccessService.createAccount(this.name, this.email, this.password)
    .subscribe({
      next: (result: any) => {
          console.log({ result });
          sessionStorage.setItem('email', result.email);
          sessionStorage.setItem('isAdmin', 'false');
          sessionStorage.setItem('accessToken', result.stsTokenManager.accessToken);
          this.router.navigate(['/home']);
      },
      error: (error: any) => {
          console.error(error);
          this.errorMessage = error;
      }
    });
  }

}
