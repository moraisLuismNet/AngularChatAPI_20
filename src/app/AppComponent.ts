import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/ChatComponent';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ChatComponent],
  templateUrl: './AppComponent.html',
  styles: [
    `
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        text-align: center;
        color: #333;
        margin-bottom: 30px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'AngularChatAPI';
}
