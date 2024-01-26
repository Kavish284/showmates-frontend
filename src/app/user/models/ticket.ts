export interface Ticket {
    _id: string;
    ticketTitle: string;
    ticketDescription: string;
    ticketPrice: number;
    totalAvailableTickets: number;
    quantity: number;
    ticketCurrency: string;
    ticketsSold: number;
    isSeasonPass:boolean;
    eventForTicket:string;
    allowedPerson:number;
    ticketStatus:string;
    ticketPriorityNumber:number;
}