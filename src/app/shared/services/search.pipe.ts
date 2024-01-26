import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../../user/models/event';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(events:Array<Event>, filterText: string): any[] {
    
    if (!events || !filterText) {
      return events;
    }

    filterText = filterText.toLowerCase();

    return events.filter(event => {
      return event.eventTitle.toLowerCase().includes(filterText);
    });
  }
}
