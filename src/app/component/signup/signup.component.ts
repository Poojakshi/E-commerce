import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

// import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // @ViewChild('myForm') myForm: NgForm;

errorMsg : string = '';

  constructor( private as : AuthService, private user : UserService, private router : Router){}
// form:any;
  ngOnInit() {
    
  }
  signup(form: NgForm){
      // console.log(form.value.name);
      // console.log(form.value.address);

    this.as.signup(form.value.email, form.value.password)
    .then ( data =>
      {
        if(data.user){
        this.user.addNewUser(data.user.uid, form.value.name, form.value.address, form.value.email)
        this.errorMsg = ''
        this.router.navigate(['/login'])
        }

    })
    .catch (err => this.errorMsg = err)
  }
  
}

// signup(form: NgForm){
  //   console.log(form.value.email);
  //   console.log(form.value.password);

  //   this.as.signup(form.value.email, form.value.password)
  //   .then (data => console.log(data))
  //   .catch (err => this.errorMsg = err)
  // }
