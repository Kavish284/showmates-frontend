import { Ticket } from "./ticket";

export interface Order {
    eventId:string;
    userId:string;
    tickets:Ticket[];
    totalPrice:Number;
    currency:string;
    paymentStatus:string;
    bookingDate:Date;
    tickerQrCode:string;
    ticketDate:Date;
    seasonPassOrder:boolean;
    regularOrderId:string;
}