import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-not-found',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  loading: boolean = true; 

  ngOnInit(): void {
    // Simulate a delay for the animation
    setTimeout(() => {
      this.loading = false; 
    }, 3000); 
}
}