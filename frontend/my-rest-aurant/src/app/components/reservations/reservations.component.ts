import { Component, OnInit, QueryList, ViewChildren, ElementRef, Input } from '@angular/core';
import { Reservation } from '../../models/reservation';
import { ReservationItemComponent } from './reservation-item/reservation-item.component';
import { CommonModule } from '@angular/common'; // Ensure CommonModule is imported
import { ReservationService } from '../../services/reservation.service'; // Import ReservationService

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReservationItemComponent], // Include CommonModule and ReservationItemComponent
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  @Input('email') userEmail: string = "" 
  @Input() isAdmin: boolean = false;

  @ViewChildren('dateSection') dateSections?: QueryList<ElementRef<HTMLDivElement>>;
  categorizedReservations: { date: string, reservations: Reservation[] }[] = [];

  constructor(private reservationService: ReservationService) {}
  
  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    if (!this.userEmail) {
      this.loadExampleReservations();  // Load example reservations if no user email is provided
      return;
    }
  
    if (this.isAdmin) {
      this.reservationService.getAllReservations().subscribe({
        next: (reservations) => {
          console.log('Received reservations:', reservations);  // Check the structure here
          this.categorizedReservations = this.groupReservationsByDate(reservations);
        },
        error: (error) => {
          console.error('Error loading all reservations from server:', error);
          this.loadExampleReservations();
        }
      });
    }
    else {
      // If the user is not an admin, load reservations specific to the user
      this.reservationService.getReservationsFromUser(this.userEmail).subscribe({
        next: (reservations) => {
          this.categorizedReservations = this.groupReservationsByDate(reservations);
        },
        error: (error) => {
          console.error('Error loading user reservations from server:', error);
          this.loadExampleReservations();  // Load example reservations in case of an error
        }
      });
    }
  }

  loadExampleReservations() {
    const exampleReservations: Reservation[] = [
      { id: 1, userid: "Adri", date: "2024-05-20", time: "13:00", numberOfPeople: 3 },
      { id: 2, userid: "Alex", date: "2024-05-21", time: "15:00", numberOfPeople: 2 },
      { id: 3, userid: "John", date: "2024-05-20", time: "17:00", numberOfPeople: 4 }
    ];
    this.categorizedReservations = this.groupReservationsByDate(exampleReservations);
  }

  groupReservationsByDate(reservations: Reservation[]): { date: string, reservations: Reservation[] }[] {
    return reservations.reduce((acc, reservation) => {
      const existingCategory = acc.find(c => c.date === reservation.date);
      if (existingCategory) {
        existingCategory.reservations.push(reservation);
      } else {
        acc.push({ date: reservation.date, reservations: [reservation] });
      }
      return acc;
    }, [] as { date: string, reservations: Reservation[] }[]);
  }
}