import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ChatService } from '../../services/chat';
import { TypewriterService } from '../../services/typewriter';
import { ChatResponse } from '../../interfaces/chat.interface';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class ChatComponent implements OnInit {
  messages: {
    sender: string;
    content: string;
    time: string;
    showTime: boolean;
    isLoading?: boolean;
  }[] = [];
  chatForm = new FormGroup({
    newMessage: new FormControl(''),
  });
  welcomeMessage: string = '';
  currentTime: string = '';
  welcomeMessageComplete: boolean = false;

  private chatService = inject(ChatService);
  private typewriterService = inject(TypewriterService);

  ngOnInit() {
    this.showInitialMessage();
  }

  showInitialMessage() {
    const welcomeText =
      '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?';
    this.typewriterService.typeMessage(welcomeText).subscribe({
      next: (text) => {
        this.welcomeMessage = text;
      },
      complete: () => {
        this.welcomeMessageComplete = true;
        this.showCurrentTime();
      },
    });
  }

  showCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  sendMessage() {
    const message = this.chatForm.value.newMessage?.trim();
    if (message) {
      const userMessage = {
        sender: 'Tú',
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        showTime: true,
      };
      this.messages.push(userMessage);
      this.chatForm.reset();

      // Force scroll after adding user message
      requestAnimationFrame(() => {
        this.scrollToBottom();
      });

      const botMessage = {
        sender: 'API',
        content: '',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        showTime: false,
        isLoading: true,
      };
      this.messages.push(botMessage);

      // Force scroll after adding the bot message
      requestAnimationFrame(() => {
        this.scrollToBottom();
      });

      this.chatService.sendMessage(userMessage.content).subscribe(
        (response: ChatResponse) => {
          botMessage.isLoading = false;
          this.typewriterService.typeMessage(response.reply).subscribe({
            next: (text) => {
              botMessage.content = text;
              requestAnimationFrame(() => {
                this.scrollToBottom();
              });
            },
            complete: () => {
              botMessage.showTime = true;
              requestAnimationFrame(() => {
                this.scrollToBottom();
              });
            },
          });
        },
        (error) => {
          botMessage.isLoading = false;
          botMessage.content =
            'Lo siento, ha ocurrido un error al procesar tu mensaje.';
          botMessage.showTime = true;
          console.error('Error:', error);
          requestAnimationFrame(() => {
            this.scrollToBottom();
          });
        }
      );
    }
  }

  private scrollToBottom() {
    const chatBody = document.querySelector('.chat-body');
    if (chatBody) {
      const scrollHeight = chatBody.scrollHeight;
      const height = chatBody.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatBody.scrollTop = maxScrollTop;
    }
  }
}
