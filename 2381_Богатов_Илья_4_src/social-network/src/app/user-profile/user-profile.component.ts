import {Component, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FeedComponent} from '../feed/feed.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  bio: string;
  avatar: string;
  email: string;
  status: string;
  role: string;
  following: Array<string>;
  followers: Array<string>;
  posts: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

interface Chat {
  _id: string;
  participants: Array<string>;
  messages: Array<object>;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule, MatIcon, NgIf, NgOptimizedImage, MatDivider, DatePipe, MatButton, FeedComponent, MatFormField, MatIconButton, MatInput, MatLabel, ReactiveFormsModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;
  ownProfile: boolean = false;
  postText: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    const userFromParams: string = this.route.snapshot.params['userId'] || '';
    const userId: string = userFromParams === 'me' ? this.cookieService.get('_id') : userFromParams;
    this.ownProfile = userId === this.cookieService.get('_id');

    this.apiService.getUserById(userId).subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
        void this.router.navigate(['/']);
      }
    });
  }

  isOwnProfile(): boolean {
    return this.ownProfile;
  }

  getIdFromCookies(): string {
    return this.cookieService.get('_id');
  }

  startChat(): void {
    this.apiService.createChat([this.cookieService.get('_id'), this.user!._id]).subscribe({
      next: (response: Chat) => {
        void this.router.navigate([`/chat/${response._id}`]);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });
  }

  createPost(): void {
    this.apiService.createPost({authorId: this.cookieService.get('_id'), content: this.postText}).subscribe({
      next: () => {
        this.postText = '';
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });
  }

  toggleSubscription(): void {
    this.apiService.toggleUserFollow(this.cookieService.get('_id'), this.user!._id).subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });
  }
}
