import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ChatService} from '../chat.service';
import {Subscription} from 'rxjs';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Message {
  senderId: string;
  content: string;
  createdAt: Date;
}

interface Chat {
  _id: string;
  participants: Array<User>;
  updatedAt: Date;
  createdAt: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    MatCard,
    DatePipe,
    MatButton,
    MatCardAvatar,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatDivider,
    MatIcon,
    NgIf,
    NgOptimizedImage,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIconButton,
    FormsModule,
    MatLabel
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chat: Chat = {_id: '', participants: [], createdAt: new Date(), updatedAt: new Date()};
  participants: Map<string, User> = new Map();
  messages: Message[] = [];
  messageText: string = '';
  private messageSubscription: Subscription | undefined;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(private route: ActivatedRoute, private chatService: ChatService, private apiService: ApiService, private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    const chatId: string = this.route.snapshot.params['chatId'] || '';

    this.apiService.getChatById(chatId).subscribe({
      next: (response: Chat) => {
        this.chat = response;
        this.participants = new Map(this.chat.participants.map((obj: User) => [obj._id, obj]));
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
        void this.router.navigate(['/chat']);
      }
    });

    this.apiService.getChatMessages(chatId).subscribe({
      next: (response: Array<Message>) => {
        this.messages = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });

    this.messageSubscription = this.chatService.getMessages().subscribe((message) => {
      console.log(message);
      if (this.chat._id === message.chatId)
        this.messages.push(message.message);
    });
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;
    this.apiService.sendMessageToChat(this.chat._id, {
      senderId: this.cookieService.get('_id'),
      content: this.messageText.trim()
    }).subscribe({
      next: (response: Message) => {
        this.messages.push(response);
        this.messageText = '';
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        alert(error.message);
      }
    });
  }

  isMessageSentByUser(message: Message) {
    return message.senderId === this.cookieService.get('_id');
  }

  ngAfterViewChecked() {
    this.scrollToLastMessage();
  }

  scrollToLastMessage(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}
