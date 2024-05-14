import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { Reservation } from '../../../models/reservation';
import { ReservationService } from '../../../services/reservation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reservation-item',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include FormsModule here
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.css']
})
export class ReservationItemComponent {
  @Input() reservationInfo?: Reservation;
  @Input() isAdmin: boolean = false;
  @Output() modify = new EventEmitter<{ field: string, value: any }>();
  @Output() delete = new EventEmitter<string>();

  showModifyOptions: boolean = false;
  modifyingField: string = '';
  modifiedValue: any;

  constructor(private reservationService: ReservationService, private router: Router) {}

  onDelete() {
    if (this.reservationInfo && this.reservationInfo.id) {
      // Ensuring id is passed as a number
      this.reservationService.deleteReservation(Number(this.reservationInfo.id)).subscribe({
        next: () => {
          console.log('Reservation deleted successfully');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['home']); // Navigate back to the current URL
          });
        },
        error: error => console.error('Error deleting reservation', error)
      });
    }
  }
  


  onModify() {
    this.showModifyOptions = !this.showModifyOptions; // Toggle modify options visibility
    this.modifyingField = 'date'; // Set modifyingField to 'numberOfPeople' when Edit is clicked
  }


  onModifyOption(field: string) {
    this.modifyingField = field;
    if (this.reservationInfo && field in this.reservationInfo) {
      const value = this.reservationInfo[field as keyof Reservation];
      this.modifiedValue = value;
    }
  }

  confirmModification() {
    if (this.reservationInfo && this.modifyingField && this.modifiedValue !== undefined) {
      const updateData = {
        USER_ID: this.reservationInfo.userid,
        ID: this.reservationInfo.id,
        Date: this.modifyingField === 'date' ? this.modifiedValue : this.reservationInfo.date,
        Time: this.modifyingField === 'time' ? this.modifiedValue : this.reservationInfo.time,
        Number_of_people: this.modifyingField === 'numberOfPeople' ? this.modifiedValue : this.reservationInfo.numberOfPeople
      };

      this.reservationService.updateReservation(updateData).subscribe({
        next: () => {
          console.log('Reservation updated successfully');
          this.modify.emit({ field: this.modifyingField, value: this.modifiedValue });
        },
        error: error => console.error('Error updating reservation', error)
      });

      // Reset modification UI state
      this.showModifyOptions = false;
      this.modifyingField = '';
      this.modifiedValue = undefined;
    }
  }
}