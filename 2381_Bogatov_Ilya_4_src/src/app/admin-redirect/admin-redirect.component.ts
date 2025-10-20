import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin-redirect',
  standalone: true,
  imports: [],
  templateUrl: './admin-redirect.component.html',
  styleUrl: './admin-redirect.component.css'
})
export class AdminRedirectComponent implements OnInit {
  ngOnInit(): void {
    window.location.replace('https://localhost:443/');
  }
}
