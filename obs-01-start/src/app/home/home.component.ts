import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription, interval} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    //Option1 (Use anonimous function)
    interval(1000).subscribe(count => {
      console.log(count);
    })

    //Option2
    this.firstObsSubscription = interval(1000).subscribe(count => this.logger(count))
  }

  logger(c: number){
    console.log(c);
  }

  ngOnDestroy(): void {
    console.log("Call ngOnDestroy and unsubscribe")
    this.firstObsSubscription.unsubscribe();
  }
 
}
