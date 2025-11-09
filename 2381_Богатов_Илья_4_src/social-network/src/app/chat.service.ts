import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private apiService: ApiService) {}

  // В REST-варианте отправка сообщений выполняется через ApiService
  sendMessage(body: {chatId: string, message: {senderId: string, content: string}}): Observable<any> {
    return this.apiService.sendMessageToChat(body.chatId, body.message);
  }

  // Поток входящих сообщений в сокетах отключен; возвращаем "тихий" Observable
  getMessages(): Observable<{ chatId: string, message: {senderId: string, content: string, createdAt: Date }}> {
    return new Observable<{ chatId: string, message: {senderId: string, content: string, createdAt: Date } }>(() => {
      // no-op: без сокетов новые сообщения приходят после отправки или при обновлении данных
      return () => {};
    });
  }
}
