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
  errorHandlingMode = false;
  isLoading = false;

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

  onCreatePost(postData: {naam: string; merk: string; voorraad: number; price: number}) {
    // Send Http request
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
    this.http.post<Product[]>('/api/v1/products', postData)
      .subscribe({
        next: data => {
          // this.spinnerService.show();
          // setTimeout(() => {
          //   this.spinnerService.hide();
          // }, 2000);
          console.log('Product added: ' + JSON.stringify(postData));
          this.fetchPosts(),
          this.isLoading = false;
        },
        error: error => {
          console.error('There was an error: ', error.message);
        }
      });
  }

  onUpdatePost(putData: { id: number, naam: string; merk: string; voorraad: number; price: number}) {
    console.log('PUT data: ' + JSON.stringify(putData));
    this.http.put<Product[]>('/api/v1/products', putData)
      .subscribe({
        next: data => {
          console.log('Product changed: ' + JSON.stringify(putData));
          this.fetchPosts()
        },
        error: error => {
          console.error('There was an error: ', error.message);
        }
      });
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
        this.errorHandlingMode = true;
      },
      error: error => {
          console.error('There was an error: ', error.message);
      }
  });
  }

  onClearPosts() {
    // Send Http request
    this.http.delete<Product>('/api/v1/products').subscribe({
      next: data => {
        console.log('All products deleted');
        this.loadedPosts = [];
      },
      error: error => {
        console.error('There was an error: ', error.message);
      }
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
    this.http.get<Product[]>('/api/v1/products').subscribe({
        next: data => {
          data.forEach(element => {
            console.log('Item: ' + element.naam)
          });
          this.loadedPosts = data;
        },
        error: error => {
          console.error('There was an error: ', error.message);
        }
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

  onHandleError() {
    this.errorHandlingMode = false;
  }

}
