export class Reservation {
    id: number = 0; 
    userid: string = "";             // Nombre de la persona que realiza la reservación
    date: string = "";             // Fecha de la reservación, en formato "YYYY-MM-DD"
    time: string = "";             // Hora de la reservación, en formato "HH:mm"
    numberOfPeople: number = 1;    // Cantidad de personas incluidas en la reservación
}

