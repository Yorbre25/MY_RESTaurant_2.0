import { DatePipe, CommonModule} from '@angular/common';
import { Component, ElementRef, ViewChild, Input } from '@angular/core';
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
  availableTimes?: { time: string, maxGuests: number }[];  // Update to hold time and max guests
  selectedTime?: string;
  selectedGuests?: number; // To hold the number of guests for the reservation
  maxGuestsAllowed?: number; // Maximum guests allowed for the selected time


  @ViewChild('message') message!: ElementRef<HTMLSpanElement>;

  @Input('email') userEmail: string = "" 

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

  selectTime(time: { time: string, maxGuests: number }): void {
    this.selectedTime = time.time;
    this.maxGuestsAllowed = time.maxGuests;
    // Optionally open a dialog or display a field to choose the number of guests here
  }

  createReservation(): void {
    if (this.selectedGuests && this.maxGuestsAllowed && this.selectedGuests > this.maxGuestsAllowed) {
      this.message.nativeElement.innerText = "Error: Number of guests exceeds the maximum allowed.";
      return;
    }
    // Here you would call a service to create the reservation with the selected date and time
    console.log(`Creating reservation for ${this.selectedDate} at ${this.selectedTime}`);
  }
}
