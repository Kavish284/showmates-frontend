import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private readonly secretKey = secretKey;

  constructor() { }
  
  encryptAndSessionStorage(key: string, value: any): void {
    const encryptedValue = CryptoJS.AES.encrypt(JSON.stringify(value), this.secretKey).toString();
    
    
    sessionStorage.setItem(key, encryptedValue);
  }

  encryptData(value: any): any {
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.secretKey).toString();
  }


  decryptData(data:string): any {
    
    if (data) {
  
      const decryptedValue = CryptoJS.AES.decrypt(data, this.secretKey).toString(CryptoJS.enc.Utf8);
     
      return JSON.parse(decryptedValue);
    }
    return null;
  }


  decryptAndGetFromSessionStorage(data:string): any {
    
    const encryptedValue = sessionStorage.getItem(data);
    if (encryptedValue) {
      const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, this.secretKey).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedValue);
    }
    return null;
  }

}
