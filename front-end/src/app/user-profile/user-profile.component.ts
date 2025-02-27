import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../_models/user.model';
//import { userProfile } from '../_models/userProfile.model';
import { LocationServicesService } from '../_services/location-services.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { register } from '../_models/register';
import { userProfile } from '../_models/userProfile.model';
import { Order } from '../_models/order.module';
import { OrderService } from '../_services/order.service';
import { UploadService } from '../_services/upload.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { ContactService } from '../_services/contact.service';
import { Complaint } from '../_models/contact.model';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, CommonModule, JsonPipe, RouterLink, RouterOutlet],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit
{

  token:any;
  userData:any;
  id:any;
  governorates: any[] = [];
  cities: any[] = [];

  // user profile 
  userProfileForm:FormGroup;

  // user Order 
  userOrder:Order[] = [];

  constructor(
    private authSer: AuthServiceService,
    private cookieServices:CookieService,
    private locationSer:LocationServicesService,
    private uploadSer:UploadService,
    private router:Router
  ) {

    this.userProfileForm = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.email]),
      street: new FormControl(''),
      city: new FormControl(''),
      cityName: new FormControl(''),
      state: new FormControl(''),
      stateName: new FormControl(''),
      zipCode: new FormControl('', [Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]),
      contactNo: new FormControl('', [Validators.pattern(/^[0-9]{10,15}$/)]),
      image: new FormControl('')
    });
    
  }


  ngOnInit(): void {
    // Get user data
    this.decodeUserToken(this.getToken()).subscribe({
      next: (data: any) => {
        this.token = data;
        console.log(data);
      }
    });
  
    if (this.token && this.token.email) {
      this.authSer.getUserDataByEmail(this.token.email).subscribe({
        next: (data) => {
          if (data._id) {
            this.id = data._id;
            this.userData = data;
            console.log(data);
            console.log(this.userData);
            this.fillFormWithUserData();
          }
        },
        error: (err) => {
          if (err.status == 401) {
            this.authSer.logout();
            this.router.navigateByUrl("user/login");
          }
          console.error("Error fetching user data", err);
        }
      });
    } else {
      console.error("Email not found in token");
    }
  
    // Assign governorates directly from local data
    this.governorates = [
      { name: "Cairo", cities: ["Nasr City", "Heliopolis", "Maadi", "Shubra", "Zamalek", "New Cairo"] },
      { name: "Alexandria", cities: ["Sidi Gaber", "Mansheya", "Smouha", "Montaza", "Borg El Arab"] },
      { name: "Giza", cities: ["Dokki", "Mohandessin", "Haram", "6th of October", "Sheikh Zayed"] },
      { name: "Qalyubia", cities: ["Banha", "Shibin El Qanater", "Khosous"] },
      { name: "Port Said", cities: ["Al Manakh", "Al Sharq", "Al Zohour"] },
      { name: "Suez", cities: ["Arbaeen", "Ganayen", "Faisal"] },
      { name: "Sharqia", cities: ["Zagazig", "Belbeis", "Minya Al Qamh"] },
      { name: "Dakahlia", cities: ["Mansoura", "Talkha", "Mit Ghamr"] },
      { name: "Aswan", cities: ["Aswan City", "Kom Ombo", "Edfu"] },
      { name: "Asyut", cities: ["Asyut City", "Dairut", "Manfalut"] },
      { name: "Beheira", cities: ["Damanhour", "Kafr El Dawar", "Rashid"] },
      { name: "Beni Suef", cities: ["Beni Suef City", "Biba", "El Wasta"] },
      { name: "Fayoum", cities: ["Fayoum City", "Tamiya", "Sinnuris"] },
      { name: "Gharbia", cities: ["Tanta", "El Mahalla El Kubra", "Zefta"] },
      { name: "Ismailia", cities: ["Ismailia City", "Fayed", "Al Qantara"] },
      { name: "Kafr El Sheikh", cities: ["Kafr El Sheikh City", "Desouk", "Baltim"] },
      { name: "Matruh", cities: ["Marsa Matruh", "Siwa", "El Dabaa"] },
      { name: "Minya", cities: ["Minya City", "Mallawi", "Beni Mazar"] },
      { name: "Monufia", cities: ["Shibin El Kom", "Menouf", "Ashmoun"] },
      { name: "New Valley", cities: ["Kharga", "Dakhla", "Farafra"] },
      { name: "North Sinai", cities: ["Arish", "Sheikh Zuweid", "Rafah"] },
      { name: "Qena", cities: ["Qena City", "Nag Hammadi", "Luxor"] },
      { name: "Red Sea", cities: ["Hurghada", "Safaga", "Marsa Alam"] },
      { name: "Sohag", cities: ["Sohag City", "Girga", "Akhmim"] },
      { name: "South Sinai", cities: ["Sharm El Sheikh", "Dahab", "Nuweiba"] },
      { name: "Damietta", cities: ["Damietta City", "New Damietta", "Faraskour"] },
      { name: "Luxor", cities: ["Luxor City", "Esna", "Armant"] }
    ];
  
    console.log(this.governorates);
  
    // Populate cities if user data contains an address
    if (this.userData && this.userData.address && this.userData.address.state) {
      const selectedGovernorate = this.governorates.find(
        (gov) => gov.name === this.userData.address.state
      );
      this.cities = selectedGovernorate ? selectedGovernorate.cities : [];
      this.fillFormWithUserData();
    }
  
    // Watch for governorate changes
    this.userProfileForm.get("state")?.valueChanges.subscribe((selectedGovernorateName) => {
      const selectedGovernorate = this.governorates.find((gov) => gov.name === selectedGovernorateName);
      this.cities = selectedGovernorate ? selectedGovernorate.cities : [];
  
      this.userProfileForm.patchValue({
        stateName: selectedGovernorate ? selectedGovernorate.name : "",
        city: null // Reset city selection when governorate changes
      });
    });
  
    // Watch for city changes
    this.userProfileForm.get("city")?.valueChanges.subscribe((selectedCity) => {
      this.userProfileForm.patchValue({
        cityName: selectedCity
      });
    });
  }
  


  
  fillFormWithUserData(): void {
    if (this.userData) {
      // Find the selected governorate based on the name stored in userData
      const selectedGovernorate = this.governorates.find(gov => gov.governorate_name_en === this.userData?.address?.state);
      
      if (selectedGovernorate) {
        // Fetch cities for the selected governorate
        this.locationSer.getCities(selectedGovernorate.id).subscribe(cityData => {
          this.cities = cityData;
  
          // Find the selected city based on the name stored in userData
          const selectedCity = this.cities.find(city => city.city_name_en === this.userData?.address?.city);
  
          // Patch the form with user data
          this.userProfileForm.patchValue({
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            email: this.userData.email,
            street: this.userData?.address?.street,
            city: selectedCity ? selectedCity.id : '',
            state: selectedGovernorate ? selectedGovernorate.id : '',
            zipCode: this.userData?.address?.zipCode,
            contactNo: this.userData.contactNo,
            image: this.userData.image,
            cityName: this.userData?.address?.city,
            stateName: this.userData?.address?.state
          });
        });
      } else {
        // Patch the form without city data if governorate is not found
        this.userProfileForm.patchValue({
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          email: this.userData.email,
          street: this.userData?.address?.street,
          city: '',
          state: '',
          zipCode: this.userData?.address?.zipCode,
          contactNo: this.userData.contactNo,
          image: this.userData.image,
          cityName: this.userData?.address?.city,
          stateName: this.userData?.address?.state
        });
      }
    }
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

onSubmit() {
  console.log(this.userData);

  if (!this.userProfileForm.valid) {
    // Display a friendly message if the form is invalid
    this.showErrorMessage("Please fill out all required fields correctly.");
    return;
  }

  // Prepare updated user data
  const updatedUserData = {
    _id: this.id,
    firstName: this.userProfileForm.get('firstName')?.value,
    lastName: this.userProfileForm.get('lastName')?.value,
    email: this.userProfileForm.get('email')?.value,
    address: {
      street: this.userProfileForm.get('street')?.value,
      city: this.userProfileForm.get('cityName')?.value,
      state: this.userProfileForm.get('stateName')?.value,
      zipCode: this.userProfileForm.get('zipCode')?.value,
    },
    contactNo: this.userProfileForm.get('contactNo')?.value,
    image: this.userProfileForm.get('image')?.value
  };

  console.log(updatedUserData);

  // Call the API to update user data
  this.authSer.updateUserData(updatedUserData, this.id).subscribe({
    next: (data) => {
      console.log('User data updated successfully', data);
      this.showSuccessMessage("Your profile has been updated successfully!");
    },
    error: (err) => {
      console.error('Error updating user data', err);
      if (err.status === 401) {
        this.authSer.logout();
        this.router.navigateByUrl("user/login");
      } else if (err.status === 400) {
        this.showErrorMessage("There was a problem updating your profile. Please check your details and try again.");
      } else {
        this.showErrorMessage("An unexpected error occurred. Please try again later.");
      }
    }
  });
}




showSuccessMessage(message: string) {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    showConfirmButton: false,
    timer: 3000
  });
}

showErrorMessage(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    showConfirmButton: true
  });
}













// // handel upload image
//   // Method to handle file input change
//   onFileChange(event:any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.userProfileForm.patchValue({
//         image: file
//       });
//       this.userProfileForm.get('image')?.updateValueAndValidity();
//       this.uploadFile(file);
//     }
//   }

//   // Method to upload file to the API
//   uploadFile(file: File) {
//     // const formData = new FormData();
//     // formData.append('file', file, file.name);

//     // const apiEndpoint = 'YOUR_API_ENDPOINT_HERE';
//     // this.http.post(apiEndpoint, formData).subscribe(response => {
//     //   console.log('API Response:', response);
//     //   // Handle the response from the API if needed
//     // }, error => {
//     //   console.error('API Error:', error);
//     //   // Handle error
//     // });
//     // console.log(file);
//     this.uploadSer.uploadImage(file).subscribe({
//       next: (data) => {
//         console.log(data);
//       }
//     })


//   }


  // Method to handle file input change
  onFileChange(event:any) {
    const file = event.target.files[0];
    if (file) {
      this.userProfileForm.patchValue({
        image: file
      });
      this.userProfileForm.get('image')?.updateValueAndValidity();
      this.uploadImage(file); // Call the uploadImage method when a file is selected
    }
  }

  // Method to upload file to the API using the service
  uploadImage(file: File) {
    this.uploadSer.uploadImage(file).subscribe({
      next: (response) => {
        
        console.log('API Response:', response);
        // Handle the response from the API if needed
      },
      error: (error) => {
        console.error('API Error:', error);
        // Handle error
      }
    });
  }







}
