import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventlistComponent } from './components/eventlist/eventlist.component';
import { SearchPipe } from '../shared/services/search.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventDetailsComponent } from './components/eventdetails/eventdetails.component';
import { LikedEventlistComponent } from './components/liked-eventlist/liked-eventlist.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DateSelectionComponent } from './components/booking-components/date-selection/date-selection.component';
import { DatepickerModule  } from 'ng2-datepicker';
import { TicketPopupComponent } from './components/booking-components/ticket-popup/ticket-popup.component';
import { OrderSummaryComponent } from './components/booking-components/order-summary/order-summary.component';
import { DatepicketDirective } from '../shared/services/datepicket.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlogPageComponent } from './components/blog-page/blog-page.component';
import { PolicyComponent } from './components/policy/policy.component';
import { TandcComponent } from './components/tandc/tandc.component';
import { YourTicketsComponent } from './components/your-tickets/your-tickets.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { EventSchemaComponent } from './components/event-schema-component/event-schema-component.component';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';


@NgModule({

  declarations: [
    EventlistComponent,
    SearchPipe,
    EventSchemaComponent,
    EventDetailsComponent,
    LikedEventlistComponent,
    UserProfileComponent, 
    DateSelectionComponent,
    TicketPopupComponent,
    OrderSummaryComponent,
    DatepicketDirective,
    BlogPageComponent,
    PolicyComponent,
    TandcComponent,
    YourTicketsComponent,
    BlogDetailsComponent,
    
  ],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    UserRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    DatepickerModule,
    MatIconModule,
    NgbModule
  ],

  exports:[
  ]

})

export class UserModule { }