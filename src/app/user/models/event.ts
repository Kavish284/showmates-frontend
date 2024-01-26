import { Time } from "@angular/common"

export interface Event {

  _id:string,
  eventImages:{
    eventCardImage:string,
    eventBannerImage:string,
    eventVenueImage:string,
  },
  eventOfflineSeller:{
    eventOfflineSellerNames:string,
    eventOfflineSellerNumbers:string,
  },
  eventLocation:{
    eventAddress:string,
    eventVenue:string,
    eventArea:string,
    eventPincode:string
    eventEmbeddedMapString:string
  },
  eventArtists:{
    eventArtistNames:string,
    eventArtistImages:string
  },
  eventTermsAndConditions:Array<string>,
  eventTitle: string,
  eventDescription: string,
  eventCatagory: string,
  eventStartDate: Date,
  eventEndDate: Date,
  eventAgeGroup:string,
  eventDuration: string,
  eventOrganizerName: string,
  eventCreatedBy:string,
  eventTicketPrice:string,
  eventLanguages: Array<string>,
  eventTime: string,
  eventLikedBy:Array<string>,
  eventLikeCount:number
  eventStatus:boolean


}
