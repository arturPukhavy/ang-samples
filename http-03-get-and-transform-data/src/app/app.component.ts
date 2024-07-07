import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { Product } from './model/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.http
      .post(
        'https://ng-complete-guide-c56d3.firebaseio.com/posts.json',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  //---Otpion 1
  // private fetchPosts() {
  //   this.http
  //     .get('http://localhost:4200/api/v1/products')
  //     .pipe(
  //       map(responseData => {
  //         const postsArray = [];
  //         for (const key in responseData) {
  //           console.log('---key: ' + key);
  //           if (responseData.hasOwnProperty(key)) {
  //             postsArray.push({ ...responseData[key], id: key });
  //           }
  //         }
  //         return postsArray;
  //       })
  //     )
  //     .subscribe(posts => {
  //       console.log(posts);
  //     });
  // }

  //---Otpion 2
  private fetchPosts() {
    this.http
      .get<Product[]>('http://localhost:4200/api/v1/products')
      .subscribe(posts => {
        posts.forEach(element => {
          console.log('Element: ' + element.naam);
        })
        this.loadedPosts = posts;
      });
  }

}
