import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ipPath } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  baseUrl = ipPath + "events/";
  upcomingEvent: any;
  approveEvents: any;
  eventsByArea: any;
  eventsLikeByUser: any;
  countApprovedEventsFetched: number = 0;
  totalApprovedEventsLength: number = 0;
  totalUpcomingEventsLength: number = 0;

  totalhomePageGarbaEventsLength: number = 0;
  homePageGarbaEvents: any;

  constructor(private http: HttpClient) { }


  createEvent(data: FormData): Observable<any> {

    return this.http.post(this.baseUrl + "addevent", data);
  }
  getUpcomingEvents(data: any, flag: any): Observable<any> {

    if (flag == 'withfilter') {
      return this.http.get(this.baseUrl + "getupcomingevents/" + data.category + "/" + data.day).pipe(
        tap((responseData) => {
          this.upcomingEvent = responseData;
        })
      );
    } else {
      if (this.upcomingEvent && this.upcomingEvent.length == this.totalUpcomingEventsLength) {

        return of(this.upcomingEvent);

      } else {

        return this.http.get(this.baseUrl + "getupcomingevents/" + data.category + "/" + data.day).pipe(
          tap((responseData) => {
            this.upcomingEvent = responseData;

            this.totalUpcomingEventsLength = responseData.upcomingEventsLength;
          })
        );
      }
    }
  }

  getHomePageGarbaEvents(): Observable<any> {


    return this.http.get(this.baseUrl + "getgarbaeventshomepage/").pipe(
      tap((responseData) => {
        this.homePageGarbaEvents = responseData;
      })
    );

  }

  getAllEventsByArea(area: string): Observable<any> {

    return this.http.get(this.baseUrl + "geteventsbyarea/" + area)

  }
  getEventLikedByUser(id: string): Observable<any> {
    if (this.eventsLikeByUser) {
      return of(this.eventsLikeByUser);
    } else {
      return this.http.get(this.baseUrl + "geteventlikebyuser/" + id).pipe(
        tap((responseData) => this.eventsLikeByUser = responseData));
    }
  }

  getSortedEvent(flag: string): Observable<any> {
    return this.http.get(this.baseUrl + "getsortedevent/" + flag);
  }

  eventApprovalByAdmin(data: string, id: string): Observable<any> {

    return this.http.patch(this.baseUrl + "updateeventapproval/" + id, { eventStatus: data });
  }

  updateEventLikedByAndEventLikeCount(eventLikedBy: Array<string>, eventLikeCount: number, id: string, flag: boolean): Observable<any> {
    return this.http.patch(this.baseUrl + "updateeventlikeandcount/" + id, { eventLikedBy: eventLikedBy, eventLikeCount: eventLikeCount, flag: flag });
  }

  getEventByid(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "geteventbyid/" + id);
  }
  getEventByidForDetails(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "geteventbyidForDetailsCustomer/" + id);
  }
  getSimilarEvent(category: string): Observable<any> {
    return this.http.get(this.baseUrl + "getsimilarevents/" + category);
  }
  getEventByEventName(name: String): Observable<any> {
    return this.http.get(this.baseUrl + "geteventbyname/" + name);
  }
  updateEvent(id: string, data: FormData): Observable<any> {
    return this.http.put(this.baseUrl + "updateevent/" + id, data);
  }


  getEventByGlobalSearch(data: String): Observable<any> {
    return this.http.get(this.baseUrl + "geteventbyglobalsearch/" + data);
  }
  getAllEventsWithOffset(offset: any): Observable<any> {
    return this.http.get(this.baseUrl + "getalleventswithoffset/" + offset);
  }
  getEventByUseridWithOffset(id: string, offset: any): Observable<any> {
    return this.http.get(this.baseUrl + "geteventbyuseridwithoffset/" + id + "/" + offset);
  }

  async getAllEventsByApprovalStatusWithOffset(status1: string, status2: string, offset: any): Promise<any> {


    if (this.approveEvents && this.totalApprovedEventsLength == this.countApprovedEventsFetched) {
    
      return this.approveEvents;
    } else {
      return await this.http.get<any>(this.baseUrl + "geteventsbyapprovalwithoffset/" + status1 + "/" + status2 + "/" + offset)
        .pipe(
          tap((responseData) => {

            if (this.approveEvents) {
              this.approveEvents.data = [...this.approveEvents.data, ...responseData.data];

            } else {
              this.approveEvents = responseData;
            }
            this.totalApprovedEventsLength = responseData.totalEventsLength;
            this.countApprovedEventsFetched = this.countApprovedEventsFetched + responseData.data.length;

          })

        ).toPromise();

    }

  }

  getAllEvents(): Observable<any> {
    return this.http.get(this.baseUrl + "getallevents");
  }
  getEventByUserid(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "geteventbyuserid/" + id);
  }
  getAllEventsByApprovalStatus(status1: string, status: string, offset: any): Observable<any> {
    return this.http.get(this.baseUrl + "geteventsbyapprovalwithoffset/" + status1 + "/" + status + "/" + offset)
  }

  //update eventdates with calander
  updateEventDatesUsingCalander(data: any): Observable<any> {
    return this.http.put(this.baseUrl + "updateeventdatesinevent", data);
  }
}
