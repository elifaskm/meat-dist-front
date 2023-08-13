import { InputsOutputs } from 'src/app/models/inputs_outputs.model';
import { Component, Input, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";

@Component({
  selector: 'app-register-input',
  templateUrl: './register-input.component.html',
  styleUrls: ['./register-input.component.scss']
})
export class RegisterInputComponent implements OnInit {
 // @Input() user: any = {};
 public meat_types: MeatType[] = [];
 public products: Product[] = [];
 public input_output: InputsOutputs = {
  id: null,
  ProductId: null,
  kilograms: null,
  pieces: null,
  boxes: null,
  amount: null,
  date: new Date(),
  type: "I"
 };
 public pageSize: number = 10;
  public pageNum: number = 0;
  private dcurrent = new Date();
  public dateString = this.dcurrent.getFullYear() + '-' + String(this.dcurrent.getMonth() + 1).padStart(2, '0') + '-' + String(this.dcurrent.getDate()).padStart(2, '0');
  public disabledKilograms = false;
  public disabledPieces = false;
  public disabledBoxes = false;
  //public selectedProduct = 1;

  constructor(public _httpService: HttpService) { }

  ngOnInit() {

    this._httpService.getMeatTypes(this.pageSize, this.pageNum).subscribe((meat_types: MeatType[]) => {
      this.meat_types = meat_types;
      this.getProductsByMeatType(this.meat_types[0].id);
    });

  }

  getProductsByMeatType(meat_typeId: number): void{
    this._httpService.getProductsByMeatType(meat_typeId).subscribe((products: Product[]) => {
      this.input_output.ProductId = products[0].id;

      this.disabledKilograms = !(products[0].by_kilograms=="Y");
      this.disabledPieces = !(products[0].by_pieces=="Y");
      this.disabledBoxes = !(products[0].by_boxes=="Y");

      this.products = products;
    })
  }

  getProductByPk(productId: any): void{
    this._httpService.getProductById(productId).subscribe((product: Product) => {
      this.disabledKilograms = !(product.by_kilograms=="Y");
      this.disabledPieces = !(product.by_pieces=="Y");
      this.disabledBoxes = !(product.by_boxes=="Y");
    })
  }

  postInputsOutputs(): void{
    this.input_output.date = new Date(this.dateString);
    this._httpService.postInputsOutputs(this.input_output).subscribe((product: Product) => {
      //this.products = product;
    })
  }

  getDate(): string{
    return this.dcurrent.getFullYear() + '-' + String(this.dcurrent.getMonth() + 1).padStart(2, '0') + '-' + String(this.dcurrent.getDate()).padStart(2, '0');
  }

}
