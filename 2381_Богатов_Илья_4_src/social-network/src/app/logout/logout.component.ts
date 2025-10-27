import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router, private cookieService: CookieService) {}
  ngOnInit(): void {
    this.cookieService.deleteAll();

    void this.router.navigate(['/']);
  }
}
