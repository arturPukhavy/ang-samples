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
  savedPosts: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { naam: string; merk: string; voorraad: number; price: number}) {
    // Send Http request
    this.http
      .post<Product[]>(
        '/api/v1/products',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
        this.savedPosts = responseData;
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }
  onDeleteProuct(id: number) {
    console.log('Delete Product by Id: ' + id);



  }
  onClearPosts() {
    // Send Http request
    this.http.delete('/api/v1/products').subscribe(() => {
      this.savedPosts = [];
      this.loadedPosts = [];
      
    });
  }

  //---Otpion 1
  // private fetchPosts() {
  //   this.http
  //     .get('/api/v1/products')
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
      .get<Product[]>('/api/v1/products')
      .subscribe(posts => {
        posts.forEach(element => {
          console.log('Item: ' + element.naam);
        })
        this.loadedPosts = posts;
      });
  }

}
