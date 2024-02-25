import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
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
  @ViewChild('endOfChat') endOfChat!: ElementRef;

  user$ = this.authService.currentUser$;
  searchControl: FormControl = new FormControl('');
  chatListControl: FormControl = new FormControl();
  messageControl: FormControl = new FormControl('');

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

  messages$ = this.chatListControl.valueChanges.pipe(
    map((value) => value[0]),
    distinctUntilChanged(),
    switchMap((chatId) => this.chatsService.getChatMessages$(chatId)),
    tap(() => this.scrollToBottom())
  );

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatsService: ChatsService
  ) {}

  createChat(user: ProfileUser) {
    this.chatsService
      .isExistingChat(user?.uid)
      .pipe(
        switchMap((chatId) => {
          if (chatId) return of(chatId);
          else return this.chatsService.createChat(user);
        })
      )
      .subscribe((chatId) => {
        this.chatListControl.setValue([chatId]);
      });
  }

  sendMessage() {
    const message = this.messageControl.value;
    const selectedChatId = this.chatListControl.value[0];

    if (message && selectedChatId) {
      this.chatsService.addChatMessage(selectedChatId, message).subscribe();
      this.scrollToBottom();
      this.messageControl.setValue('');
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat)
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
