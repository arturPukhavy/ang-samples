import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  id: number;
  private event: boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
    });
  }

  onActivate() {
    this.event = !this.event;

    if(this.userService.activatedEmitter instanceof EventEmitter){
      console.log('Use EventEmitter')
    } else {
      console.log('Use Subject')
    }

    //--- Option1: Use EventEmitter
    //this.userService.activatedEmitter.emit(this.event);

    //--- Option2: Use Subject
    this.userService.activatedEmitter.next(this.event);
  }
}
