import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription, interval, Observable} from 'rxjs';

import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  constructor() { }

  // --- Example1: rxjs Observable
  // ngOnInit() {
  //   //Option1 (Use anonimous function)
  //   interval(1000).subscribe(count => {
  //     console.log(count);
  //   })
  //   //Option2
  //   this.firstObsSubscription = interval(1000).subscribe(count => this.logger(count))
  // }

  // --- Example2: Custom Observable with operators
  ngOnInit(): void {
    const customIntervalObservable = Observable.create(observer =>{
      let count = 0;
      setInterval(() => {
        observer.next(count);
        if(count ===  2) {
          observer.complete();
        }
        if(count > 3) {
          observer.error(new Error('Count is > 3'));
        }
        count++;

      }, 1000);
    });

    this.firstObsSubscription = customIntervalObservable
    // Example of operators
    .pipe(filter( (data: number) => {
      return data > 0;
    }), map( data =>{
      return 'Transformed data: ' + data
    }))
    // Subscribe after applying operators
    .subscribe(
      data => {
      this.logger(data);
    }, error => {
      console.log(error);
      alert(error.message);
    }, complete => {
      console.log('Complete!');
    }
    )
  }
  
  logger(c: number){
    console.log(c);
  }

  ngOnDestroy(): void {
    console.log("Call ngOnDestroy and unsubscribe")
    this.firstObsSubscription.unsubscribe();
  }
}
