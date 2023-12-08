
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import firebase  from 'firebase/compat/app';

interface UserData {
  name: string; 
  displayName: string;
  email:string;
  address:string;
  userProfileData: any;
  

}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  editing: boolean = false;
  currentUser: any;
  profileForm!: FormGroup;
  isEditMode: boolean = false;
  updateSuccess: boolean = false;
  userProvidedPassword: string = '';
  showPasswordChangeMessage: boolean = false;
  userProfileData: any;

  constructor(private formBuilder: FormBuilder, private fauth : AngularFireAuth, private as : AngularFirestore, private router: Router) {
   }


//   user={
//   name:'',
//   email:'',
//   address:''
// };

ngOnInit(): void {
  this.fauth.currentUser.then(user => {
    if (user) {
      this.as.collection('users').doc(user.uid).valueChanges().subscribe((userData: any) => {
        this.currentUser = userData;
        this.createForm(); // Create form after fetching data
      });
    }
  });
  
}

createForm(): void {
  this.profileForm = this.formBuilder.group({
    name: this.currentUser.name,
    email: this.currentUser.email,
    address: this.currentUser.address
    // Other form fields...
  });
}

toggleEditMode(): void {
  this.isEditMode = !this.isEditMode;

  if (this.isEditMode) {
    if (!this.profileForm) {
      this.createForm(); 
    } else {
      this.profileForm.patchValue({  
        name: this.currentUser.name,
        email: this.currentUser.email,
        address: this.currentUser.address
      });
    }
  }
}


async promptForPassword(): Promise<string | null> {
  return new Promise((resolve) => {
    // Simulating a prompt or dialog for password input
    const passwordInput = prompt('Please enter your current password:');
    
    if (passwordInput !== null) {
      // Password was provided, return it
      resolve(passwordInput);
    } else {
      // User canceled or did not provide the password
      resolve(null);
    }
  });
}


async getCurrentUser(): Promise<firebase.User | null> {
  const user = await this.fauth.currentUser;
  return user;
}
async fetchUserProfileData() {
  try {
    const user =  await this.getCurrentUser();
    if (user) {
      const userProfile = await this.fetchUserProfile(user.uid);

      // Check if userProfile exists and has data before assigning it
      if (userProfile && userProfile.exists) {
        this.userProfileData = userProfile.data();
      }
    }
  } catch (error) {
    console.error('Error fetching user profile data:', error);
  }
}

async fetchUserProfile(uid: string): Promise<any> {
  try {
    const userProfile = await this.as.collection('users').doc(uid).get().toPromise();
    return userProfile; // Return the entire document snapshot
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

async saveChanges(): Promise<void> {
  try {
    const user = await this.fauth.currentUser;
    if (user) {
      const uid = user.uid;
      const updatedData = this.profileForm.value;

      if (updatedData && updatedData.email) {
        const previousEmail = user.email || '';

        const password = await this.promptForPassword();

        if (password !== null && typeof password === 'string' && previousEmail) {
          const credential = firebase.auth.EmailAuthProvider.credential(previousEmail, password);

          try {
            await user.reauthenticateWithCredential(credential);

            if (user.email !== updatedData.email) {
              try {
                await user.verifyBeforeUpdateEmail(updatedData.email);

                // Update email in Firestore
                try {
                  await this.as.collection('users').doc(uid).update({
                    email: updatedData.email,
                    address: updatedData.address
                    // Update other profile fields as needed
                  });

                  console.log('Firestore updated successfully');

                  // Fetch updated profile data from Firestore
                  const updatedProfile = await this.fetchUserProfile(uid);

                  // Now you can use the updatedProfile data to update the profile page
                  this.userProfileData = updatedProfile; // Update the profile data to reflect changes
                } catch (firestoreError) {
                  console.error('Firestore update error:', firestoreError);
                  // Handle Firestore update error
                }

                await this.fauth.signOut();
                this.router.navigate(['/login']);
              } catch (verificationError) {
                console.error('Email verification error:', verificationError);
                // Handle verification error
              }
            } else {
              console.log('Email unchanged. No need for verification.');
            }
          } catch (reAuthError) {
            console.error('Re-authentication error:', reAuthError);
            // Handle re-authentication error
          }
        } else {
          console.error('Password or previous email is null, empty, or not a string.');
        }
      } else {
        console.error('No valid email to update');
      }
    } else {
      console.error('User not logged in');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
}

