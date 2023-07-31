import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {throwError} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
   products! : Array<Product>;
   errorMessage! : String;
   searchFormGroup! : FormGroup;


  constructor(private productService : ProductService, private fb : FormBuilder) {
  }


  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control(null)
    });
    this.handelGetAllProducts();
  }

  handelGetAllProducts(){
    this.productService.getAllProducts().subscribe({
      next : (data )=>{
        this.products = data;
      },
      error : (err)=>{
        this.errorMessage=err;
      }
    });
  }
  handleDeleteProduct(p: Product) {
    let conf=confirm("Are you sure !");
    if(conf === false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next : (data)=>{
       // this.handelGetAllProducts();
        let index = this.products.indexOf(p);
        this.products.splice(index,1);
      }
    });

  }

  handelSetPromotion(p: Product) {
    let promo =  p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next : (data) => {
        p.promotion = !promo;
      },
      error : err => {
        this.errorMessage = err;
      }
    });

  }

  handelSearchProduct() {
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProduct(keyword).subscribe(
      {
        next :(data )=>{
          this.products=data;
        }
      }
    )

  }
}
