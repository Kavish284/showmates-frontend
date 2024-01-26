import { Component, ElementRef, ViewChild } from '@angular/core';
import { Profile } from '../../../user/models/profile'; 
import { ConfirmationResult } from 'firebase/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from 'src/app/shared/services/session.service'; 
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import firebase from "firebase/compat/app";
import { WindowService } from 'src/app/shared/services/window.service';
import { EmailService } from 'src/app/shared/services/email.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EncryptionService } from 'src/app/shared/services/encryption.service';

@Component({
  selector: 'app-login-model',
  templateUrl: './login-model.component.html',
  styleUrls: ['./login-model.component.css']
})
export class LoginModelComponent {
  @ViewChild('otpContainer') otpContainer: ElementRef;
  otpInputs: HTMLInputElement[] = [];

  profile: any;
  isLoading = false;
  verificationCode: string;
  verificationCodeSent = false;
  verificationCodeId: ConfirmationResult;
  receivedVerificationCode: string;
  windowRef: any;
  appVerifier: any;
  mobileLoginCount = 0;
  loginForm: FormGroup;
  verifyOtpForm: FormGroup;
  paidApiForNumberData: any;
  formFlag = true;
  verifyOtpFormFlag = false;
  isPhoneNumberEntered = false;


  OtpForLogin;

  //for resend otp paid api
  resendCooldownSeconds = 60;
  remainingTime = this.resendCooldownSeconds;
  canResendOTP = true;
  resendTimeout: any;
  startTimerFlag = false;


  constructor(private formBuilder: FormBuilder, private encryptionService: EncryptionService, private el: ElementRef, private emailService: EmailService, private afAuth: AngularFireAuth, private sessionService: SessionService, private toasterService: ToastrService, private router: Router, private windowService: WindowService) {
    this.loginForm = this.formBuilder.group({
      data: ['', [Validators.required]]
    });

    this.verifyOtpForm = this.formBuilder.group({
      num1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      num2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      num3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      num4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      num5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      num6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]]
    })

    this.windowRef = this.windowService.windowRef;
  }

  setupOtpInputListeners(): void {
    setTimeout(() => {
      this.otpInputs = this.otpContainer.nativeElement.querySelectorAll('.form-control');

      this.otpInputs.forEach((inputElement, index) => {
        inputElement.addEventListener('input', () => this.handleInput(inputElement, index));
      });
    }, 1000);
  }

  handleInput(inputElement: HTMLInputElement, index: number): void {
    const maxLength = parseInt(inputElement.getAttribute('maxlength'));
    const currentValue = inputElement.value;

    // If the current input field is not empty and its length is equal to the maximum length,
    // find the next input field and focus on it
    if (currentValue && currentValue.length === maxLength) {
      const nextIndex = index + 1;

      if (nextIndex < this.otpInputs.length) {
        this.otpInputs[nextIndex].focus();
      }
    }
  }

  //firebase phone number otp
  sendVerificationCode() {
    if (this.loginForm.valid) {

      this.appVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );


      this.afAuth
        .signInWithPhoneNumber("+91" + this.loginForm.get('data')?.value?.trim(), this.appVerifier)
        .then((result) => {


          this.windowRef.confirmationResult = result;
          this.verifyOtpFormFlag = true;
          this.setupOtpInputListeners();
          this.formFlag = false;


          // Start the cooldown period
          if (this.verifyOtpFormFlag) {
            this.stopResendCooldown();
            // Disable the resend button
            this.canResendOTP = false;
            this.startResendCooldown();
          }
        })
        .catch((error) => {
          this.toasterService.error(error, "", { timeOut: 3000 })
        });

    } else {

      this.toasterService.error("please enter correct number/email!", "", { timeOut: 3000 });
    }

  }

  startResendCooldown() {
    this.resendTimeout = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.stopResendCooldown();
      }
    }, 1000);
  }
  stopResendCooldown() {
    clearInterval(this.resendTimeout);
    this.canResendOTP = true;
    this.remainingTime = this.resendCooldownSeconds;
  }

  //paid api for sending OTP to number
  async sendVerificationCodeFromPaidApi() {
    if (this.loginForm.valid) {

      await this.sessionService.sendOTP(this.loginForm.get('data')?.value?.trim()).subscribe((observer) => {
        if (observer.statusCode == 200) {


          //otp send successfully so decrypting data coming from backend
          const decryptedValue = this.encryptionService.decryptData(observer.data);
          this.paidApiForNumberData = decryptedValue;

          // Start the cooldown period
          if (this.verifyOtpFormFlag) {
            this.stopResendCooldown();
            // Disable the resend button
            this.canResendOTP = false;
            this.startResendCooldown();
          }
        } else {
          this.toasterService.error("Error sending OTP,please check you number or try with email!", "", { timeOut: 3000 });
        }
      })
    } else {
      this.toasterService.error("please enter correct number/email!", "", { timeOut: 3000 });
    }
  }

  //code verification sent from paid api for numer/otp
  async verifyCodeForPaidApi(value: any) {

    this.receivedVerificationCode = this.verifyOtpForm.get('num1').value + this.verifyOtpForm.get('num2').value + this.verifyOtpForm.get('num3').value + this.verifyOtpForm.get('num4').value + this.verifyOtpForm.get('num5').value + this.verifyOtpForm.get('num6').value;

    if (value.OTP == this.receivedVerificationCode) {

      const data = {
        phone: this.loginForm.get('data')?.value?.trim(),
        OTP: value.OTP,
        role: "customer"
      };

      await this.sessionService.loginWithPhone(data).subscribe((observer) => {

        if (observer.statusCode == 200) {

          const payload = JSON.parse(atob(observer.token.split('.')[1]));

          const encryptedRole = this.encryptionService.encryptData(payload.role);
     
          
          localStorage.setItem('id', payload.id);
          localStorage.setItem('expiresIn', payload.exp);
          localStorage.setItem('role', encryptedRole);
          localStorage.setItem('token',observer.token);

          this.isLoading = false;
          if (observer.data.role == "customer")
            location.reload();
          if (observer.data.role == "organizer")
            this.router.navigate([observer.data.role]);
          this.toasterService.success(observer.message, "", { timeOut: 3000 });

          document.getElementById('ModalClose')?.click();

        } else {
          this.isLoading = false;
          this.router.navigate(["/"]);
          this.toasterService.error(observer.message, "", { timeOut: 3000 });
          document.getElementById('ModalClose')?.click();
        }
      });

    } else {
      this.isLoading = false;
      this.verifyOtpFormFlag = false;
      this.formFlag = true;
      this.verifyOtpForm.get('num1').setValue('');
      this.verifyOtpForm.get('num2').setValue('');
      this.verifyOtpForm.get('num3').setValue('');
      this.verifyOtpForm.get('num4').setValue('');
      this.verifyOtpForm.get('num5').setValue('');
      this.verifyOtpForm.get('num6').setValue('');

      document.getElementById('ModalClose')?.click();
      this.router.navigate(["/"]);
      this.toasterService.error("OTP entered was wrong,please try again!", "", { timeOut: 3000 });
    }
  }
  async resendOtp() {
    if (this.isPhoneNumberEntered) {
      this.sendVerificationCodeFromPaidApi();
    } else {
      this.OtpForLogin = Math.floor(100000 + Math.random() * 900000);
      const data = {
        email: this.loginForm.get('data')?.value.trim(),
        OTP: this.OtpForLogin
      };
      const encryptedData = this.encryptionService.encryptData(data);
      //send otp via email
      await this.emailService.emailForOtp(encryptedData).subscribe();
      if (this.verifyOtpFormFlag) {
        this.stopResendCooldown();
        // Disable the resend button
        this.canResendOTP = false;
        this.startResendCooldown();
      }
    }
  }
  changeFlags() {
    this.formFlag = true;
    this.verifyOtpFormFlag = false;
    this.loginForm.reset();
    //this.appVerifier.reset();
  }

  //verify code by firebase
  verifyCode() {
    this.receivedVerificationCode = this.verifyOtpForm.get('num1').value + this.verifyOtpForm.get('num2').value + this.verifyOtpForm.get('num3').value + this.verifyOtpForm.get('num4').value + this.verifyOtpForm.get('num5').value + this.verifyOtpForm.get('num6').value;

    this.windowRef.confirmationResult
      .confirm(this.receivedVerificationCode)
      .then(async (result) => {

        const data = {
          phone: this.loginForm.get('data')?.value?.trim(),
          OTP: this.OtpForLogin,
          role: "customer"
        };

        await this.sessionService.loginWithPhone(data).subscribe((observer) => {

          if (observer.statusCode == 200) {

            const payload = JSON.parse(atob(observer.token.split('.')[1]));


            const encryptedRole = this.encryptionService.encryptData(payload.role);
      
            localStorage.setItem('id', payload.id);
            localStorage.setItem('expiresIn', payload.exp);
            localStorage.setItem('role', encryptedRole);
            localStorage.setItem('token', observer.token);
            
            this.isLoading = false;
            if (observer.data.role == "customer")
              location.reload();
            if (observer.data.role == "organizer")
              this.router.navigate([observer.data.role]);
            this.toasterService.success(observer.message, "", { timeOut: 3000 });
            document.getElementById('ModalClose')?.click();

          } else {
            this.isLoading = false;
            this.router.navigate(["/"]);
            this.toasterService.error(observer.message, "", { timeOut: 3000 });
            document.getElementById('ModalClose')?.click();
          }
        });

      }).catch((error: any) => {
        this.isLoading = false;
        this.verifyOtpFormFlag = false;
        this.formFlag = true;
        this.verifyOtpForm.get('num1').setValue('');
        this.verifyOtpForm.get('num2').setValue('');
        this.verifyOtpForm.get('num3').setValue('');
        this.verifyOtpForm.get('num4').setValue('');
        this.verifyOtpForm.get('num5').setValue('');
        this.verifyOtpForm.get('num6').setValue('');


        this.appVerifier.clear();
        document.getElementById('ModalClose')?.click();
        this.router.navigate(["/"]);
        this.toasterService.error("Otp entered was wrong,please try again!", "", { timeOut: 3000 });
      });
  }

  //for login with email
  verifyEmailOtp(data: any): boolean {
    this.receivedVerificationCode = this.verifyOtpForm.get('num1').value + this.verifyOtpForm.get('num2').value + this.verifyOtpForm.get('num3').value + this.verifyOtpForm.get('num4').value + this.verifyOtpForm.get('num5').value + this.verifyOtpForm.get('num6').value;
    const otp = this.receivedVerificationCode;

    if (otp == data) {
      return true;
    }
    return false;
  }

  //for login with email/number accordingly
  async login() {

    if (this.isEmail(this.loginForm.get('data')?.value.trim())) {
      const data = {
        email: this.loginForm.get('data')?.value.trim(),
        OTP: this.OtpForLogin,
        role: "customer"
      };

      if (this.verifyEmailOtp(data.OTP)) {

        await this.sessionService.loginWithEmail(data).subscribe(async (observer) => {

          if (observer.statusCode == 200) {


            const payload = JSON.parse(atob(observer.token.split('.')[1]));

            const encryptedRole = this.encryptionService.encryptData(payload.role);
         

            localStorage.setItem('id', payload.id);
            localStorage.setItem('expiresIn', payload.exp);
            localStorage.setItem('role', encryptedRole);
            localStorage.setItem('token', observer.token);
            this.isLoading = false;

            if (observer.data.role == "customer")
              location.reload();
            if (observer.data.role == "organizer")
              this.router.navigate([observer.data.role]);

            this.toasterService.success(observer.message, "", { timeOut: 3000 });

          } else {
            this.isLoading = false;
            this.toasterService.error(observer.message, "", { timeOut: 3000 });
          }
          document.getElementById('ModalClose')?.click();
        })

      } else {
        this.isLoading = false;
        this.verifyOtpFormFlag = false;
        this.verifyOtpForm.get('num1').setValue('');
        this.verifyOtpForm.get('num2').setValue('');
        this.verifyOtpForm.get('num3').setValue('');
        this.verifyOtpForm.get('num4').setValue('');
        this.verifyOtpForm.get('num5').setValue('');
        this.verifyOtpForm.get('num6').setValue('');


        this.router.navigate(["/"]);
        this.toasterService.error("Otp entered was wrong,please try again!", "", { timeOut: 3000 });
        document.getElementById('ModalClose')?.click();
      }
    } else {
      //verify code for firebase 
      //this.verifyCode();
      //verify code for paid api for number
      this.verifyCodeForPaidApi(this.paidApiForNumberData);
    }

  }

  isNumber(value) {
    return /^[6-9]\d{9}$/.test(value);
  }

  isEmail(value) {
     // Define a regular expression pattern for a valid email address
     var pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

     // Use the test() method to check if the email matches the pattern
     var isEmailValid = pattern.test(value);
 
     // Check if the email matches the pattern and if the domain is one of the specified ones
     if (isEmailValid) {
         var domain = value.split('@')[1].toLowerCase();
         if (['gmail.com', 'yahoo.com', 'outlook.com'].includes(domain)) {
             return true;
         }
     }
     
     return false;
  }

  //check and send otp for email/number accordingly 
  async sendOtp() {

    if (this.loginForm.valid) {
      this.verifyOtpFormFlag = true;
      this.startTimerFlag = true;
      this.setupOtpInputListeners();
      this.formFlag = false;

      this.OtpForLogin = Math.floor(100000 + Math.random() * 900000);
      const data = {
        email: this.loginForm.get('data')?.value.trim(),
        OTP: this.OtpForLogin
      };

      //sending encrypted data
      let encryptedData = this.encryptionService.encryptData(data);

      if (this.isEmail(data.email)) {
       
        this.isPhoneNumberEntered = false;
        //send otp via email
        await this.emailService.emailForOtp(encryptedData).subscribe();
        // Start the cooldown period
        if (this.verifyOtpFormFlag) {
          this.stopResendCooldown();
          // Disable the resend button
          this.canResendOTP = false;
          this.startResendCooldown();
        }
      } else if (this.isNumber(data.email)) {
    
        //send otp via phone(firebase)
        //await this.sendVerificationCode();
        this.isPhoneNumberEntered = true;
        await this.sendVerificationCodeFromPaidApi();
      } else {
        this.loginForm.get('data')?.setErrors({ invaliddata: true });
        this.verifyOtpFormFlag = false;
        this.formFlag = true;
        this.verifyOtpForm.get('data').setValue('');
        this.toasterService.error("Please enter valid email or phone number");
      }

    } else {
      //handle error in login form

      this.toasterService.error("", "", { timeOut: 3000 });
    }
  }

  ngOnDestroy() {
    clearInterval(this.resendTimeout);
  }

}
