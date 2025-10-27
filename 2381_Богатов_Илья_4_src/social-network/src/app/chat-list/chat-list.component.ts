import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatCard, MatCardAvatar, MatCardHeader, MatCardTitle, MatCardSubtitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Chat {
  _id: string;
  participants: Array<User>;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardAvatar,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatIcon,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    RouterLink,
    DatePipe
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit{
  chatList: Chat[] = [];

  constructor(private apiService: ApiService, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.apiService.getUserChats(this.cookieService.get('_id')).subscribe({
      next: (response: {totalCount: number, value: Chat[]}) => {
        this.chatList = response.value;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });
  }

  formatParticipants(chat: Chat): string {
    const participants = chat.participants
      .slice(0, 3) // Берём только первых трех участников
      .map(user => `${user.firstName} ${user.lastName}`); // Преобразуем их в строки "Имя Фамилия"

    return participants.length < chat.participants.length
      ? `${participants.join(', ')}, ...`
      : participants.join(', ');
  }
}
