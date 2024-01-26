import { NgModule } from '@angular/core';
import { PreLoaderComponent } from "./components/pre-loader/pre-loader.component";
import { ErrorComponent } from "./components/error/error.component";
import { HomeComponent } from "./components/home/home.component";
import { FooterComponent } from "./components/footer/footer.component";
import { UserheaderComponent } from "./components/userheader/userheader.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule  } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginModelComponent } from './components/login-model/login-model.component';
import { ListYoureventComponent } from './components/list-yourevent/list-yourevent.component';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({

  declarations: [
    PreLoaderComponent,
    ErrorComponent,
    HomeComponent,
    FooterComponent,
    UserheaderComponent,
    LoginModelComponent,
    ListYoureventComponent
  ],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CarouselModule,
    ReactiveFormsModule,
    NgbModule,
    SharedRoutingModule
  ],
  exports:[
    PreLoaderComponent,
    ErrorComponent,
    FooterComponent,
    UserheaderComponent,
    LoginModelComponent,
    ListYoureventComponent,
    CarouselModule,
  ]

})

export class SharedModule { }