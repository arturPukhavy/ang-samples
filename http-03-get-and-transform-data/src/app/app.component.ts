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
  editMode = false;
  editItemIndex: number;  
  editedItem: Product;

  constructor(private http: HttpClient) {}
  

  ngOnInit() {
    this.fetchPosts();

    this.startedEditing
      .subscribe(
        (index: number) => {
          this.editItemIndex = index;
          console.log('Product to edit: ' + JSON.stringify(this.getProduct(index)));
          this.editMode = true;
          this.editedItem = this.getProduct(index);
          this.productForm.setValue({
            id: this.getProduct(index).id,
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
    console.log('PUT data: ' + JSON.stringify(putData));
    this.http.put<Product[]>('/api/v1/products', putData)
      .subscribe()
      this.fetchPosts();
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }
  onDeleteProduct(id: number) {
    // Create options 
    const options = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json',
      // }),
      body: {
        id:id
      },
    };

    // Option1: Delete a product in BE 
    // this.http.delete('/api/v1/product', options).subscribe();
    // this.loadedPosts = this.loadedPosts.filter(item => item.id !== id);
    // console.log('Delete Product by Id: ' + id);

    // Option2: Delete a product in BE (better solution!)
    this.http.delete('/api/v1/product', options).subscribe({
      next: data => {
        this.loadedPosts = this.loadedPosts.filter(item => item.id !== id);
        console.log('Delete successful, id: ' + id);
      },
      error: error => {
          console.error('There was an error: ', error.message);
      }
  });
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
  }
  getProduct(index: number) {
    return this.loadedPosts[index];
  }

  onCancel() {
    this.productForm.reset();
    this.editMode = false;

  }

}
