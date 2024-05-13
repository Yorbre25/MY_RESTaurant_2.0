import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserAccessService } from '../../../services/user-access.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  errorMessage: string = '';

  constructor(private userAccessService: UserAccessService, private router: Router){}

  submitForm() {
    sessionStorage.clear()
    this.errorMessage = "";
    if(this.username == ""){
      this.errorMessage = "Missing user email";
      return;
    }
    if(this.password == ""){
      this.errorMessage = "Missing user password";
      return;
    }
    this.userAccessService.checkLogin(this.username, this.password).subscribe({
      next: (result: any) => {
          console.log({ result });
          sessionStorage.setItem('email', result.user.email);
          sessionStorage.setItem('isAdmin', result.isAdmin);
          sessionStorage.setItem('accessToken', result.user.stsTokenManager.accessToken);
          this.router.navigate(['/home']);
      },
      error: (error: any) => {
          console.error(error);
          this.errorMessage = error;
      }
    });
  }
}
