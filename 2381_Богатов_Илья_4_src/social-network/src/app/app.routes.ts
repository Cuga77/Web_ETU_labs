import {Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {FeedComponent} from './feed/feed.component';
import {LoginComponent} from './login/login.component';
import {AdminRedirectComponent} from './admin-redirect/admin-redirect.component';
import {noAuthGuard} from './no-auth.guard';
import {authGuard} from './auth.guard';
import {FollowListComponent} from './follow-list/follow-list.component';
import {LogoutComponent} from './logout/logout.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ChatComponent} from './chat/chat.component';
import {ChatListComponent} from './chat-list/chat-list.component';

export const routes: Routes = [
  {path: 'register', component: RegisterComponent, canActivate: [noAuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [noAuthGuard]},
  {path: 'logout', component: LogoutComponent, canActivate: [authGuard]},
  {path: 'user/:userId', component: UserProfileComponent, canActivate: [authGuard]},
  {path: 'chat', component: ChatListComponent, canActivate: [authGuard]},
  {path: 'chat/:chatId', component: ChatComponent, canActivate: [authGuard]},
  {path: 'feed', component: FeedComponent, canActivate: [authGuard]},
  {path: 'followers', component: FollowListComponent, canActivate: [authGuard], data: {type: 'followers'}},
  {path: 'following', component: FollowListComponent, canActivate: [authGuard], data: {type: 'following'}},
  {path: 'admin', component: AdminRedirectComponent, canActivate: [authGuard]},
  {path: '', redirectTo: '/feed', pathMatch: 'full'}, // перенаправление на главный маршрут
  {path: '**', redirectTo: '/feed'} // перенаправление для несуществующих маршрутов
];
