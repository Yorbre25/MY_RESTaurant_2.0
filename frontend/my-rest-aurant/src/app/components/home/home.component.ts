import { Component, OnInit } from '@angular/core';
import { MealRecommendationComponent } from "../meal-recommendation/meal-recommendation.component";
import { ReservationComponent } from "../reservation/reservation.component";
import { FeedbackComponent } from "../feedback/feedback.component";
import { MenuComponent } from "../menu/menu.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { PromoteUserAdminComponent } from '../promote-user-admin/promote-user-admin.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [MealRecommendationComponent, ReservationComponent, FeedbackComponent, MenuComponent, NavbarComponent, PromoteUserAdminComponent]
})
export class HomeComponent implements OnInit{

    isAdmin = false;
    userName: string = "";


    ngOnInit(): void {
        this.isAdmin = sessionStorage.getItem('isAdmin') == 'true';
        this.userName = sessionStorage.getItem('email') ?? "";
    }

}
