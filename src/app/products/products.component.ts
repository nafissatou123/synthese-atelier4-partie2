import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  constructor(private productService:ProductService,
              private router:Router, public appState : AppStateService) {}

  ngOnInit() {
    this.searchProduct();
}

  searchProduct(){
    // this.appState.setProductState({
    //   status :"LOADING"
    //   });
  this.productService.searchProduct(this.appState.productState.keyword,this.appState.productState.currentPage,
    this.appState.productState.pageSize).subscribe({
      next: (resp) => {
        let products = resp.body as Product[];
        let totalProducts:number = parseInt(resp.headers.get('x-total-count')!);
        //this.appState.productState.totalProducts=totalProducts;
        let totalPages= Math.floor(totalProducts/this.appState.productState.pageSize);
        if (totalProducts % this.appState.productState.pageSize != 0){
          ++totalPages;
        }
        this.appState.setProductState({
          products : products,
          totalProducts : totalProducts,
          totalPages : totalPages,
          status : "LOADED"
        })
      },
      error: err => {
        this.appState.setProductState({
          status :"ERROR",
          errorMessage : err
        })
      }
    })
  //this.products=this.productService.getProduct();
}



  handleCheckProduct(product: Product){
    this.productService.CheckProduct(product).subscribe({
      next : updatedProduct=>{
        product.checked=!product.checked;
        //this.getProduct();
      }
    })
  }

  handleDelete(product: Product) {
    if (confirm("Etes-vous sur de vouloir supprimer?"))
    this.productService.deleteProduct(product).subscribe({
      next : value => {
       // this.getProduct();
       //  this.appState.productState.products=this.appState.productState.products
       //    .filter((p:any)=>p.id!=product.id);
        this.searchProduct();
      }
    })
  }

  handleGoToPage(page: number) {
    this.appState.productState.currentPage=page;
    this.searchProduct();
  }

  handleEdit(product: Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`)

  }
}
