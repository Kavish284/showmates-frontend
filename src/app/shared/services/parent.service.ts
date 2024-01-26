import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentComponentService {
  private parentComponentName = new Subject<string>();

  parentComponentName$ = this.parentComponentName.asObservable();

  setParentComponentName(componentName: string) {
    this.parentComponentName.next(componentName);
  }
}
