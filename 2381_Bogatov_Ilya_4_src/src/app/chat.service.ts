import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable, Observer} from 'rxjs';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: Socket, private apiService: ApiService) {}

  sendMessage(body: {chatId: string, message: {senderId: string, content: string}}): void {
    this.socket.emit('message', body);
  }

  getMessages(): Observable<{ chatId: string, message: {senderId: string, content: string, createdAt: Date }}> {
    return new Observable<{ chatId: string, message: {senderId: string, content: string, createdAt: Date }}>((subscriber) => {
      this.socket.on('message', (data: { chatId: string, message: {senderId: string, content: string, createdAt: Date }}) => {
        subscriber.next(data);
      });

      return () => this.socket.off('message');
    });
  }
}
