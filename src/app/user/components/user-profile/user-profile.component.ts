import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Profile } from '../../models/profile';
import { SessionService } from '../../../shared/services/session.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { EmailService } from 'src/app/shared/services/email.service';
import { WindowService } from 'src/app/shared/services/window.service';
import firebase from "firebase/compat/app";
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  profile: any;
  profileForm: FormGroup
  maxDate;
  emailOtpVerified: boolean;
  phoneOtpVerified: boolean;
  verifyPhoneOtp: boolean;
  verifyEmailOtp: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  windowRef: any;
  appVerifier: any;
  inputOtp: number;
  generatedOtp: number;

  constructor(private sessionService: SessionService, private emailService: EmailService,private afAuth:AngularFireAuth,private windowService:WindowService,private encryptionService: EncryptionService, private formBuilder: FormBuilder, private toasterService: ToastrService, private router: Router) {

    const userId = localStorage.getItem("id");
    this.sessionService.getUserById(userId).subscribe((observer) => {
      if (observer.statusCode == 200) {

        this.profile = observer.data;
        this.createFormWithDefaultValues();
      } else {
        this.toasterService.error(observer.message, "", { timeOut: 3000 })
      }
    })
    const currentDate = new Date();
    this.maxDate = currentDate.toISOString().split('T')[0];
    this.windowRef=this.windowService.windowRef;

  }

  createFormWithDefaultValues() {
    this.profileForm = this.formBuilder.group({
      name: [this.profile.name, [this.LengthValidator]],
      email: [this.profile.email, [Validators.email]],
      phone: [this.profile.phone, [this.phoneNumberSizeValidator, this.phoneNumberValidator]],
      location: [this.profile.location, [Validators.minLength(2)]],
      birthdate: [this.profile.birthdate]

    })
  }

  phoneNumberSizeValidator(control: FormControl) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.length !== 10) {
      return { invalidSizePhoneNumber: true };
    }

    return null;
  }

  phoneNumberValidator(control: FormControl) {
    const phoneNumber = control.value;
    const pattern = /^[6-9]\d{9}$/;

    if (phoneNumber && !pattern.test(phoneNumber)) {
      return { invalidPatternPhoneNumber: true };
    }

    return null;
  }

  LengthValidator(control: FormControl) {
    const data = control.value;
    if (data && !(data.length >= 2 && data.length <= 20)) {

      return { invalidLength: true };
    }

    return null;
  }
    // UPDATE PHONE STEPS STARTED
    makeFalseIsPhoneVerified() {
      this.isPhoneVerified = false;
    }
  
    makeTrueIsPhoneVerified() {
      this.isPhoneVerified = true;
    }
  
    //firebase phone number otp
    verfiyPhoneToUpdate() {
  
  
      this.appVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );
  
      this.verifyPhoneOtp = true;
      this.afAuth
        .signInWithPhoneNumber("+91" + this.profileForm.get('phone').value.trim(), this.appVerifier)
        .then((result) => {
          this.windowRef.confirmationResult=result;
        })
        .catch((error) => {
          this.toasterService.error(error, "", { timeOut: 3000 })
        });
  
  
    }
    async checkOtptoUpdatePhone() {
      //verify code by firebase
    
      await this.windowRef.confirmationResult
        .confirm(this.inputOtp)
        .then((result) => {
          this.phoneOtpVerified=true;
          this.isPhoneVerified=true;
          this.profileForm.get('phone').disable();
        }).catch((error: any) => {
  
          this.appVerifier.clear();
          this.router.navigate([""]);
          this.toasterService.error("Otp entered was wrong,please try again!", "", { timeOut: 3000 });
        });
        this.inputOtp=null;
    }
     // UPDATE PHONE STEPS ENDED
  
    // UPDATE EMAIL STEPS STARTED
    makeFalseIsEmailVerified() {
      this.isEmailVerified = false;
    }
  
    makeTrueIsEmailVerified() {
      this.isEmailVerified = true;
    }
  
    async verfiyEmailToUpdate() {
      this.verifyEmailOtp = true;
      this.generatedOtp = Math.floor(100000 + Math.random() * 900000);
  
      const data = {
        email: this.profileForm.get('email').value.trim(),
        OTP: this.generatedOtp
      }
  
      const encryptedData = this.encryptionService.encryptData(data);
     
      await this.emailService.emailForOtp(encryptedData).subscribe((observer) => {
        if (observer.statusCode == 200) {
  
  
        } else {
          this.toasterService.error("Error sending OTP,please try again after sometime.", "", { timeOut: 3000 })
        }
  
      });
    }
    checkOtpToUpdateEmail() {
  
      if (this.generatedOtp == this.inputOtp) {
        this.emailOtpVerified = true;
        this.isEmailVerified=true;
       
        this.profileForm.get('email').disable();
       
      } else {
        this.toasterService.error("OTP entered was wrong!", "", { timeOut: 3000 });
        this.router.navigate([""]);
      }
      this.inputOtp=null; 
    }
    // UPDATE EMAIL STEPS ENDED

  updateProfile() {

    if(this.profileForm.get('email').disabled)
      this.profileForm.get('email').enable();
    if(this.profileForm.get('phone').disabled)
      this.profileForm.get('phone').enable();
    if (this.profileForm.valid) {

      this.profile.name = this.profileForm.get('name').value?.trim();
      this.profile.email = this.profileForm.get('email').value?.trim();
      this.profile.phone = this.profileForm.get('phone').value?.trim();
      this.profile.location = this.profileForm.get('location').value?.trim();
      this.profile.birthdate = this.profileForm.get('birthdate').value?.trim();


      this.sessionService.updateProfile(this.profile._id, this.profile).subscribe((observer) => {
        if (observer.statusCode == 200) {
          this.router.navigate([""]);
          this.toasterService.success(observer.message, "", { timeOut: 3000 });
        } else {
          this.toasterService.error(observer.message, "", { timeOut: 3000 });
        }
      })
    } else {
      //handle error in profile form 

    }
  }

}
