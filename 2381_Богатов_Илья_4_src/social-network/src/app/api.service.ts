import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  register(body: Object): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, body);
  }

  login(body: Object): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, body);
  }

  getUserFeed(id: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/feed/${id}?skip=${(page - 1) * 20}&limit=20`);
  }

  getUserFollowList(id: string, type: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}/${type}?skip=${(page - 1) * 20}&limit=20`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }

  toggleUserFollow(id: string, followingId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribe`, {id, followingId});
  }

  createChat(participants: Array<string>): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, {participants});
  }

  getUserChats(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}/chats`);
  }

  getChatById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/${id}`);
  }

  getChatMessages(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/${id}/messages`);
  }

  getUserPosts(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}/posts`);
  }

  sendMessageToChat(id: string, body: {senderId: string, content: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat/${id}`, body);
  }

  createPost(body: {authorId: string, content: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/post`, body);
  }

  ping(): string {
    return 'pong';
  }
}
