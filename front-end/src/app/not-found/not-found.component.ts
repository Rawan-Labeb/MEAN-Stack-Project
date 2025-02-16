import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for standalone components

@Component({
  selector: 'app-not-found',
  standalone: true, // Use standalone components (optional)
  imports: [CommonModule], // Import CommonModule for routerLink
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  loading: boolean = true; // Loading state

  ngOnInit(): void {
    // Simulate a delay for the animation
    setTimeout(() => {
      this.loading = false; // Hide the loading screen after 3 seconds
    }, 3000); // Adjust the duration as needed
}
}