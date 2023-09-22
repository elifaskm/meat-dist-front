import { Component, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { Stock } from "src/app/models/stock.model";
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";
import { Branch } from "src/app/models/branch.model";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";

@Component({
  selector: 'app-totals-by-product',
  templateUrl: './totals-by-product.component.html',
  styleUrls: ['./totals-by-product.component.scss']
})
export class TotalsByProductComponent implements OnInit {
  public meat_types: MeatType[] = [];
  public products: Product[] = [];
  public stocks: Stock[] = [];
  public branches: Branch[];

  public filterParams:any = {
    meatType: null,
    productId: null,
    branchId: null
  }

  public pages: number[] = [1];
  public currentPage: number = 1;

  constructor(public _httpService: HttpService) { }

  ngOnInit() {
    this._httpService.getMeatTypes(10, 0).subscribe((meat_types: MeatType[]) => {
      this.filterParams.meatType = 0;
      let itemAll: MeatType[] = [];
      itemAll.push({
        id: 0,
        is_deleted: 'N',
        meat_name: 'Todos'
      });

      this.meat_types = itemAll.concat(meat_types);
      this.getProductsByMeatType(this.meat_types[0].id);
    });

    this._httpService.getAllWarehouse().subscribe((branches: Branch[]) => {
      this.filterParams.branchId = branches[0].id;
      this.branches = branches;
    });
  }

  findStock(){
    this._httpService.getFullStock(this.filterParams).subscribe((stocks: Stock[]) => {
      this.stocks = stocks;
    });
  }

  getProductsByMeatType(meat_typeId: number): void{
    this._httpService.getProductsByMeatType(meat_typeId).subscribe((products: Product[]) => {
      this.filterParams.productId = 0;
      let itemAll: Product[] = [];
      itemAll.push({
        id: 0,
        description: "Todos",
        by_kilograms: "",
        by_pieces: "",
        by_boxes: "",
        is_deleted: "selected",
        meat_typeId: 0,
        price: 0,
        calc_by: ""
      });

      products.sort((a, b) => (a.description > b.description) ? 1 : -1);

      this.products = itemAll.concat(products);
    })
  }

  onSubmit(f) {

    this.filterParams.meatType = f.value.meatType;
    this.filterParams.productId = f.value.product;
    this.filterParams.branchId = f.value.warehouse;

    this.findStock();
  }

  exportToPDF(){
    if(this.stocks.length==0){
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'No hay registros para exportar',
        showConfirmButton: false,
        timer: 1500
      });

      return false;
    }
    let texto: string = `Tipo de carne: ${this.meat_types.find(x=>x.id==this.filterParams.meatType).meat_name}, Tipo de producto: ${this.products.find(x=>x.id==this.filterParams.productId).description}, Almacén: ${this.branches.find(X=>X.id==this.filterParams.branchId).name}`;
    const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape", format: 'letter'} );
    doc.text(texto,20,20);
    doc.table(20, 30, this.generateData(), this.headers, { autoSize: false });
    doc.save("totales_por_producto_almacen.pdf");
  }

  generateData() {
    let result = [];
    var data = {
      PRODUCTO:"",
      TIPO: "",
      TOTAL_KILOS: "",
      TOTAL_PIEZAS: "",
      TOTAL_CAJAS: "",
      MONTO: ""
    };

    let MXpesos = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

    let totalAmount: number = 0;
    this.stocks.forEach((stock, index, array)=>{

      data.PRODUCTO = stock.description;
      data.TIPO = stock.meat_name;
      data.TOTAL_KILOS = stock.total_kilograms ? stock.total_kilograms.toString() : " ";
      data.TOTAL_PIEZAS = stock.total_pieces ? stock.total_pieces.toString() : " ";
      data.TOTAL_CAJAS = stock.total_boxes ? stock.total_boxes.toString() : " ";
      data.MONTO = MXpesos.format(stock.amount);

      totalAmount = Number(totalAmount) + Number(stock.amount);

      result.push(Object.assign({}, data));
    });

    data.PRODUCTO = "";
    data.TIPO = "";
    data.TOTAL_KILOS = "";
    data.TOTAL_PIEZAS = "";
    data.TOTAL_CAJAS = "";
    data.MONTO = "";
    result.push(Object.assign({}, data));

    data.PRODUCTO = "TOTAL";
    data.TIPO = "====";
    data.TOTAL_KILOS = "====";
    data.TOTAL_PIEZAS = "====";
    data.TOTAL_CAJAS = "====";
    data.MONTO = MXpesos.format(totalAmount);
    result.push(Object.assign({}, data));

    return result;
  };

  createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {

      result.push({
        id: keys[i].n,
        name: keys[i].n,
        prompt: keys[i].n,
        width: keys[i].w,
        align: keys[i].a,
        padding: 0
      });
    }
    return result;
  }

  public headers = this.createHeaders([
    {n: "PRODUCTO", w: 50, a: "left"},
    {n: "TIPO", w: "30", a: "center"},
    {n: "TOTAL_KILOS", w: "50", a: "center"},
    {n: "TOTAL_PIEZAS", w: "50", a: "center"},
    {n: "TOTAL_CAJAS", w: "50", a: "center"},
    {n: "MONTO", w: "40", a: "right"}
  ]);

  getTotal():number{

    const sum = this.stocks.reduce((accumulator, value) => {
      return Number(accumulator) + Number(value.amount);
    }, 0);

    return sum;
  }

}
