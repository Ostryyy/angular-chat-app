import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  user$ = this.authService.currentUser$;
  searchControl: FormControl = new FormControl('');
  chatListControl: FormControl = new FormControl();

  myChats$ = this.chatsService.myChats$;

  users$ = combineLatest([
    this.userService.allUsers$,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, user, searchString]) =>
      users.filter(
        (u) =>
          u.displayName
            ?.toLowerCase()
            .includes(searchString?.toLowerCase() || '') && u.uid !== user?.uid
      )
    )
  );

  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats$,
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value[0])));

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatsService: ChatsService
  ) {}

  createChat(user: ProfileUser) {
    this.chatsService.createChat(user).subscribe();
  }
}
