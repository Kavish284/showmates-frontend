import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AngularFireModule } from "@angular/fire/compat";
import { AppComponent } from "./app.component";
import { WindowService } from "./shared/services/window.service";
import { AuthGuard } from "./shared/services/auth.guard";
import { AuthInterceptorService } from "./shared/services/auth-interceptor.service";
import { environment } from "src/environments/environment.development";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoaderService } from "./shared/services/loader.service";
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule  } from "@angular/material/icon";
import { DatePipe } from '@angular/common';
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent
   ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FlexLayoutModule,
    ScrollingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    SharedModule
  ],
  exports:[
   
  ],
  providers: [
    WindowService,
    { 
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptorService,
      multi:true,
    },
    AuthGuard,
    LoaderService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }