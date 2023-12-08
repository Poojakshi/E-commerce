import { Component, OnInit } from '@angular/core';
import { ContactusService } from 'src/app/services/contactus.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit{

  contactFormModel = {
    name: '',
    email: '',
    number:'',
    message: ''
  };
  formSubmitted = false;
  formError = false;
  message: string = '';
  // contactusService: any;

  constructor(private contactusService: ContactusService) {}

  submitForm() {
    // console.log('Form submitted:', this.contactFormModel);
    // Implement your logic to send the form data to the server here.
    // You can use a service to send the form data to your server.
    this.contactusService.submitForm(this.contactFormModel)
      .then(() => {
        this.message='Form submission successful';
        this.formSubmitted = true;
        this.formError = false;
        setTimeout(() => {
          this.message = '';
        }, 3000);
      })
      .catch((error: any) => {
        console.error('Form submission failed:', error);
        this.formSubmitted = false;
        this.formError = true;
        setTimeout(() => {
          this.message = '';
        }, 3000);
        // Handle the error, e.g., display an error message to the user.
      });
  }
  ngOnInit(): void {}
    // center: google.maps.LatLngLiteral = {
    //   lat: 12.976750,
    //     lng: 77.575280
    // };
    // zoom = 4;
    // markerOptions: google.maps.MarkerOptions = {
    //     draggable: false
    // };
    // markerPositions: google.maps.LatLngLiteral[] = [];
    // addMarker(event: google.maps.MapMouseEvent) {
    //     if (event.latLng != null) this.markerPositions.push(event.latLng.toJSON());
    // }
}
