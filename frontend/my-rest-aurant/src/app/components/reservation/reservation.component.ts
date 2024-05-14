import { DatePipe, CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { ReservationsComponent } from '../reservations/reservations.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FormsModule, CommonModule, ReservationsComponent],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  selectedDate?: Date;
  displayCalendar: boolean = false;
  availableTimes?: string[];  // Array to hold available times for the selected date
  selectedTime?: string; // To hold the selected time for final reservation

  @ViewChild('message') message!: ElementRef<HTMLSpanElement>;

  constructor(private reservationService: ReservationService) {}

  toggleCalendar(): void {
    this.displayCalendar = !this.displayCalendar; // Toggle calendar display
  }

  checkAvailability(): void {
    if (this.selectedDate) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      if (formattedDate) {
        this.reservationService.getReservationInfo({ fecha: formattedDate }).subscribe({
          next: (times) => {
            this.availableTimes = times; // Assuming the backend returns an array of strings
            this.displayCalendar = false; // Optionally close the calendar here
          },
          error: () => {
            this.message.nativeElement.innerText = "Error checking availability.";
          }
        });
      }
    }
  }

  selectTime(time: string): void {
    this.selectedTime = time; // Save the selected time
    // Proceed to create a reservation or further actions
  }

  createReservation(): void {
    // Here you would call a service to create the reservation with the selected date and time
    console.log(`Creating reservation for ${this.selectedDate} at ${this.selectedTime}`);
  }
}
