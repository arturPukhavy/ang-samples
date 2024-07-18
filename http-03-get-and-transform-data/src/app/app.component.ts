import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { Subject, Subscription} from 'rxjs';
import { Product } from './model/product.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Product[] = [];
  startedEditing = new Subject<number>();
  @ViewChild('postForm') productForm: NgForm; 
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;  
  editedItem: Product;
  currentId: number; 

  constructor(private http: HttpClient) {}
  

  ngOnInit() {
    this.subscription = this.startedEditing
      .subscribe(
        (index: number) => {
          this.editItemIndex = index;
          console.log(this.getProduct(index));
          this.editMode = true;
          this.editedItem = this.getProduct(index);
          this.productForm.setValue({
            naam: this.editedItem.naam,
            merk: this.editedItem.merk,
            voorraad: this.editedItem.voorraad,
            price: this.editedItem.price
          })
        }
    ) 
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
      });
      this.fetchPosts();
  }
  onUpdatePost(putData: { id: number, naam: string; merk: string; voorraad: number; price: number}) {
    this.http.put<Product[]>('/api/v1/products', putData)
      .subscribe()
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }
  onDeleteProduct(id: number) {
    this.http.delete('/api/v1/products').subscribe();
      this.loadedPosts = this.loadedPosts.filter(item => item.id !== id);
      console.log('Delete Product by Id: ' + id);    
  }

  onClearPosts() {
    // Send Http request
    this.http.delete<Product>('/api/v1/products').subscribe(() => {
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

  onEditProduct(index: number) {
    this.startedEditing.next(index);
    this.currentId = index
  }
  getProduct(index: number) {
    return this.loadedPosts[index];
  }

  onCancel() {
    this.productForm.reset();
    this.editMode = false;

  }

}
