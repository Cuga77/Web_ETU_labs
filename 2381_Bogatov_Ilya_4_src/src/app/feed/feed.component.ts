import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {ApiService} from '../api.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

interface Post {
  _id: string;
  authorId: string;
  content: string;
  media: Array<object>;
  reactions: Array<object>;
  comments: Array<object>;
  createdAt: Date;
  updatedAt: Date;
}

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface FeedResponse {
  totalCount: number;
  posts: Array<Post>;
  authors: Array<Author>;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgOptimizedImage, MatIcon, RouterLink],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  authors: Map<string, Author> = new Map();

  constructor(private apiService: ApiService, private cookieService: CookieService) {}
  ngOnInit(): void {
    this.apiService.getUserFeed(this.cookieService.get('_id')).subscribe({
      next: (response: FeedResponse) => {
        this.posts = response.posts;
        this.authors = new Map(response.authors.map((obj: Author) => [obj._id, obj]));
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });
  }
}
