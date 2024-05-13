import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MealRecommendationService } from '../../services/meal-recommendation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input('email') userEmail: string = "" 

  constructor(private router: Router, private mealService: MealRecommendationService){}

  logout() {
    this.mealService.clearMeals();
    sessionStorage.clear()
    this.router.navigate(['/login'])
  }

}
