import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypewriterService {
  private messageSubject = new BehaviorSubject<string>('');
  public message$ = this.messageSubject.asObservable();

  typeMessage(message: string, speed: number = 50): Observable<string> {
    return new Observable((observer) => {
      let currentText = '';
      let index = 0;

      const interval = setInterval(() => {
        if (index < message.length) {
          currentText += message[index];
          this.messageSubject.next(currentText);
          observer.next(currentText);
          index++;
        } else {
          clearInterval(interval);
          observer.complete();
        }
      }, speed);

      return () => {
        clearInterval(interval);
      };
    });
  }
}
