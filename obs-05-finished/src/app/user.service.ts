import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {

  //--- Option 1: use EventEmitter
  //activatedEmitter = new EventEmitter<boolean>();
  
  //--- Option 1: use Subject
  activatedEmitter = new Subject<boolean>();
}
