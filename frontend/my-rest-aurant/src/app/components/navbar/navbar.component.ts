import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input('email') userEmail: string = "" 

  constructor(private router: Router){}

  logout() {
    sessionStorage.clear()
    this.router.navigate(['/login'])
  }

}
