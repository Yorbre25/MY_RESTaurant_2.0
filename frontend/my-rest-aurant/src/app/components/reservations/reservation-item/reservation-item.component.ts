import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { Reservation } from '../../../models/reservation';

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

  onDelete() {
    if (this.reservationInfo) {
      this.delete.emit(this.reservationInfo.id);
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
      this.modify.emit({ field: this.modifyingField, value: this.modifiedValue });
      // Reset the modification view
      this.showModifyOptions = false;
      this.modifyingField = '';
      this.modifiedValue = undefined;
    }
  }
}