import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  profileComponentInstance: any;

  constructor(private as : AuthService, private router : Router){}

  login(form: NgForm){
    this.as.login(form.value.email, form.value.password)
    .then()
    .catch(err => console.log(err))
    this.router.navigate(['/'])
  }
  
}

