import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../_services/contact.service';
import { ContactCusService } from '../_services/contact-cus.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private contactCusService: ContactCusService) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.contactCusService.submitComplaint(formData).subscribe(
        (response) => {
          console.log('Response from server:', response);
          alert('Message sent successfully!');
          this.contactForm.reset();
        },
        (error) => {
          console.error('Error sending message:', error);
          alert('An error occurred while sending your message.');
        }
      );
    } else {
      alert('Please fill out all fields correctly.');
    }
  }

  get firstName() {
    return this.contactForm.get('firstName');
  }

  get lastName() {
    return this.contactForm.get('lastName');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }
}