import { DatePipe, CommonModule } from '@angular/common';
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
  availableTimes?: { time: string, maxGuests: number }[];
  selectedTime?: string;
  maxGuestsAllowed?: number;
  showNewReservationButton: boolean = true; // Initially allow a new reservation
  selectedGuests: number = 1; // Default to 1 guest

  @ViewChild('message') message!: ElementRef<HTMLSpanElement>;
  @Input('email') userEmail: string = "";
  @Input('isAdmin') isAdmin: boolean = false;

  constructor(private reservationService: ReservationService) {}

  toggleCalendar(): void {
    this.displayCalendar = !this.displayCalendar;
    this.showNewReservationButton = !this.displayCalendar; // Toggle based on calendar display
  }

  incrementGuests(): void {
    if (this.maxGuestsAllowed && this.selectedGuests < this.maxGuestsAllowed) {
      this.selectedGuests++;
    }
  }

  decrementGuests(): void {
    if (this.selectedGuests > 1) {
      this.selectedGuests--;
    }
  }

  checkAvailability(): void {
    if (this.selectedDate) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.availableTimes = [];
      for (let hour = 9; hour <= 21; hour++) {
        this.availableTimes.push({ time: `${hour}:00`, maxGuests: 5 });
      }
    }
  }

  selectTime(time: { time: string, maxGuests: number }): void {
    this.selectedTime = time.time;
    this.maxGuestsAllowed = time.maxGuests;
    this.showNewReservationButton = false; // Hide the new reservation button once time is selected
  }

  onSubmit(): void {
    if (this.selectedDate) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
  
      if (!formattedDate) {
        console.error('Invalid date');
        return;
      }
  
      if (this.selectedTime && this.selectedGuests) {
        this.reservationService.createReservation(this.userEmail, formattedDate, this.selectedTime, this.selectedGuests)
        .subscribe({
          next: response => {
            console.log('Reservation created successfully', response);
            // Additional logic if needed
          },
          error: error => console.error('Failed to create reservation', error)
        });
      
      }
    }

    this.selectedDate = undefined;
    this.selectedTime = undefined;
    this.selectedGuests = 1;
    this.availableTimes = [];
    this.displayCalendar = false;
    this.showNewReservationButton = true; // Show the 'New Reservation' button again
  }
  }
  

  