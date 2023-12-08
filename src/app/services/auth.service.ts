import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase  from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }

  user : Observable<firebase.User | null>
  userId : string =''

  constructor(private fauth : AngularFireAuth, private router: Router) { 
    this.user = fauth.user;
  }

  signup(email : string, password : string){
    return this.fauth.createUserWithEmailAndPassword(email, password);
  }

  login(email : string, password : string){
    return this.fauth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.fauth.signOut();
  }

  async getUser(): Promise<firebase.User | null> {
    const userCredential = await this.fauth.authState.toPromise();
    return userCredential ? userCredential : null;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.fauth.currentUser; // Use 'await' to get the user object
      
      if (user) {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email!, currentPassword);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
        console.log('Password updated successfully!');
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
  
  async changeEmail(currentPassword: string, newEmail: string): Promise<void> {
    try {
      const user = await this.fauth.currentUser; // Use 'await' to get the user object
      
      if (user) {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email!, currentPassword);
        await user.reauthenticateWithCredential(credential);
        await user.updateEmail(newEmail);
        console.log('Email updated successfully!');
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error changing email:', error);
      throw error;
    }
  }
}
