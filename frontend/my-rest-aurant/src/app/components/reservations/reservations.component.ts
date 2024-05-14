import { Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { Reservation } from '../../models/reservation';
import { ReservationItemComponent } from './reservation-item/reservation-item.component';
import { CommonModule } from '@angular/common'; // Ensure CommonModule is imported

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReservationItemComponent], // Include CommonModule and ReservationItemComponent
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  @ViewChildren('dateSection') dateSections?: QueryList<ElementRef<HTMLDivElement>>;
  categorizedReservations: { date: string, reservations: Reservation[] }[] = [];

  ngOnInit(): void {
    this.loadReservations();
  }

  deleteReservation(reservationId: string) {
    // Implement logic to delete the reservation by ID
    console.log('Deleting reservation with ID:', reservationId);
    // Remove reservation from the list
    this.categorizedReservations = this.categorizedReservations.map(cat => ({
      date: cat.date,
      reservations: cat.reservations.filter(res => res.id !== reservationId)
    }));
  }
  
  modifyReservation(modifiedReservation: Reservation) {
    // Implement logic to modify the reservation
    const categories = this.categorizedReservations.find(cat => cat.date === modifiedReservation.date);
    if (categories) {
      const index = categories.reservations.findIndex(res => res.id === modifiedReservation.id);
      if (index !== -1) {
        categories.reservations[index] = modifiedReservation;
        console.log('Modifying reservation:', modifiedReservation);
      }
    }
  }

  loadReservations() {
    // Simulated data with 'id' field added
    const exampleReservations = [
      { id: "res1", name: "Adri", date: "2024-05-20", time: "13:00", numberOfPeople: 3 },
      { id: "res2", name: "Alex", date: "2024-05-21", time: "15:00", numberOfPeople: 2 },
      { id: "res3", name: "John", date: "2024-05-20", time: "17:00", numberOfPeople: 4 }
    ];

    // Categorize reservations by date
    this.categorizedReservations = exampleReservations.reduce((acc, reservation) => {
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
