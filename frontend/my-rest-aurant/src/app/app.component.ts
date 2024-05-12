import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,  
    HttpClientModule,
    AngularFireAuthModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-rest-taurant';
}
