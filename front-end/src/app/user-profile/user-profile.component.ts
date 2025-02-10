import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../_models/user.model';
//import { userProfile } from '../_models/userProfile.model';
import { LocationServicesService } from '../_services/location-services.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, CommonModule, JsonPipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit
{

  token:any;
  userData:any;

  // address 
  governorates: any[] = [];
  cities: any[] = [];

  // user profile 
  userProfileForm:FormGroup;

  constructor(
    private authSer: AuthServiceService,
    private cookieServices:CookieService,
    private locationSer:LocationServicesService
  ) {
    // form initalization 
    this.userProfileForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]),
      contactNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      image: new FormControl('')
    
    })


  }

  ngOnInit(): void {
    // get user data
    this.token = this.decodeUserToken(this.getToken());
    if (this.token && this.token.email) {
      this.authSer.getUserDataByEmail(this.token.email).subscribe({
        next: (data) => {
          this.userData = data;
          console.log(this.userData); // Log userData after it is set
        },
        error: (err) => console.error('Error fetching user data', err)
      });
    } else {
      console.error('Email not found in token');
    }

    // get location
    this.locationSer.getGovernorates().subscribe({
      next: (data) => {
        for(var i =0; i<data[2].data.length; i++)
        {
          this.governorates.push(data[2].data[i])
        }

        // this.governorates = data[2].data
        console.log(this.governorates)
      }
    })

    this.userProfileForm.get('state')?.valueChanges.subscribe(governorateId => {
      this.locationSer.getCities(governorateId).subscribe(data => {
        this.cities = data;
        console.log(data)
        console.log(governorateId)
      });
    });
    
    this.locationSer.getCities(1).subscribe({
      next: (data) => console.log(data)
    })

  }
  
  getToken(): string {
    return this.cookieServices.get('token'); 
  }

  decodeUserToken(token: string): any {
    try {
      const decoded = this.authSer.decodeToken(token);
      console.log('Decoded Token:', decoded); // Log the decoded token
      return decoded;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }
  
  onSubmit()
  {

  }


}
