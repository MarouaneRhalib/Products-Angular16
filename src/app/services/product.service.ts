import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {Product} from "../model/product.model";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import {UUID} from "angular2-uuid";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products! : Array<Product>;
  constructor() {
    this.products = [
      {id: UUID.UUID(), name : "Computer", price : 6500, promotion : true},
      {id: UUID.UUID(), name : "Printer", price : 1200, promotion : false},
      {id: UUID.UUID(), name : "Smart Phone", price : 1400, promotion : true}
    ];
  }

  public  getAllProducts() : Observable<Product[]>{
     return of(this.products);
  }
  public deleteProduct(id : string) : Observable<boolean> {
    this.products = this.products.filter(p=>p.id!=id);
    return of(true)

  }
  public setPromotion(id : string) : Observable<boolean>{
    let product = this.products.find(p=>p.id==id);
    if (product != undefined){
    product.promotion =! product.promotion;
    return of(true)
    } else return throwError(() => ("Product not found"));
  }

  public searchProduct(keyword : string) : Observable<Product[]>{
    let products = this.products.filter(p=>p.name.includes(keyword));
    return of(products);
  }


}
