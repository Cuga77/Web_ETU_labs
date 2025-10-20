import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ApiService} from '../api.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

interface Follow {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

@Component({
  selector: 'app-follow-list',
  standalone: true,
  imports: [
    DatePipe,
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './follow-list.component.html',
  styleUrl: './follow-list.component.css'
})
export class FollowListComponent implements OnInit {
  type: string = 'followers';
  followList: Follow[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.data['type'];
    this.apiService.getUserFollowList(this.cookieService.get('_id'), this.type).subscribe({
      next: (response: {totalCount: number, value: Follow[]}) => {
        this.followList = response.value;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });
  }
}
