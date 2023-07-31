import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
   products! : Array<Product>;
   currentPage : number = 0;
   pageSize : number = 5;
   totalPages : number = 0;
   errorMessage! : String;
   searchFormGroup! : FormGroup;
   currentAction : string="all";


  constructor(private productService : ProductService, private fb : FormBuilder) {
  }


  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control(null)
    });
    this.handelGetPageProducts();
  }
  handelGetPageProducts(){
    this.productService.getPageProducts(this.currentPage, this.pageSize).subscribe({
      next : (data )=>{
        this.products = data.products;
        this.totalPages = data.totalepages;
      },
      error : (err)=>{
        this.errorMessage=err;
      }
    });
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
    if(!conf) return;
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
    this.currentAction="search";
    this.currentPage=0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProduct(keyword, this.currentPage, this.pageSize).subscribe(
      {
        next :(data )=>{
          this.products=data.products;
          this.totalPages=data.totalepages;
        }
      }
    )

  }

  goToPage(i: number) {
    this.currentPage=i;
    if(this.currentAction==="all") this.handelGetPageProducts();
    if(this.currentAction==="search") this.handelSearchProduct();



  }
}
