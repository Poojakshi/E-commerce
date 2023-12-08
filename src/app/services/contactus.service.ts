import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactusService {
  constructor(private firestore: AngularFirestore) {}

  submitForm(formData: any): Promise<any> {
    return this.firestore.collection('contactForms').add(formData);
  }
  
}
