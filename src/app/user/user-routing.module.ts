import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventlistComponent } from './components/eventlist/eventlist.component';
import { EventDetailsComponent } from './components/eventdetails/eventdetails.component';
import { LikedEventlistComponent } from './components/liked-eventlist/liked-eventlist.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { OrderSummaryComponent } from './components/booking-components/order-summary/order-summary.component';
import { BlogPageComponent } from './components/blog-page/blog-page.component';
import { TandcComponent } from './components/tandc/tandc.component';
import { PolicyComponent } from './components/policy/policy.component';
import { YourTicketsComponent } from './components/your-tickets/your-tickets.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { ErrorComponent } from '../shared/components/error/error.component';
import { HomeComponent } from '../shared/components/home/home.component';

const routes: Routes = [
  
  {path:"blog",component:BlogPageComponent},
  {path:"blog-details/:id",component:BlogDetailsComponent},
  {path:"termsandcondition",component:TandcComponent},
  {path:"policy",component:PolicyComponent},
  {path:"tickets",component:YourTicketsComponent,canActivate:[AuthGuard],data:{roles:['admin','customer']}},
  { path: "event-list", component: EventlistComponent },
  { path: "user-profile", component: UserProfileComponent,canActivate:[AuthGuard],data:{roles:['admin','customer']} },
  { path: "likedevent-list", component: LikedEventlistComponent,canActivate:[AuthGuard],data:{roles:['admin','customer']} },
  { path: "event-details/:id", component: EventDetailsComponent },
  { path: "order-summary", component: OrderSummaryComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }