import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { Reservation } from '../../../models/reservation';
import { ReservationService } from '../../../services/reservation.service';
@Component({
  selector: 'app-reservation-item',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include FormsModule here
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.css']
})
export class ReservationItemComponent {
  @Input() reservationInfo?: Reservation;
  @Output() modify = new EventEmitter<{ field: string, value: any }>();
  @Output() delete = new EventEmitter<string>();

  showModifyOptions: boolean = false;
  modifyingField: string = '';
  modifiedValue: any;

  constructor(private reservationService: ReservationService) {}

  onDelete() {
    if (this.reservationInfo) {
      this.reservationService.deleteReservation(this.reservationInfo.id).subscribe({
        next: () => console.log('Reservation deleted successfully'),
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
      const updatedReservation = { ...this.reservationInfo, [this.modifyingField]: this.modifiedValue };
      this.reservationService.updateReservation(this.reservationInfo.id, updatedReservation).subscribe({
        next: () => console.log('Reservation updated successfully'),
        error: error => console.error('Error updating reservation', error)
      });
      this.showModifyOptions = false;
      this.modifyingField = '';
      this.modifiedValue = undefined;
    }
  }
}