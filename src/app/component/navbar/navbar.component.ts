import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  isUser: boolean=false;

  constructor( private as : AuthService) {}
  isOpen: boolean=false;

  toggleNavBar(){
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
// can modify this to get navbar
    this.as.user.subscribe(user =>
      {
      if(user){
        this.isUser = true
        this.as.userId = user.uid
        // console.log(this.isUser);
      }
      else{ 
        this.isUser = false
        this.as.userId = ''
        // console.log(this.isUser);
      }
     })
 }

  logout(){
    this.as.logout();
  }

}
