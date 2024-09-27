import { RepByDate } from './../../../models/rep_by_date';
import { Component, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";
import { Branch } from "src/app/models/branch.model";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { RepStockResidue } from './../../../models/rep_stock_residue';

@Component({
  selector: 'app-residue-of-branch',
  templateUrl: './residue-of-branch.component.html',
  styleUrls: ['./residue-of-branch.component.scss']
})
export class ResidueOfBranchComponent implements OnInit {
  public meat_types: MeatType[] = [];
  public products: Product[] = [];
  public repStockResidue: RepStockResidue[] = [];
  public branches: Branch[];

  public filterParams:any = {
    meatType: null,
    productId: null,
    branchId: null,
    iniDate: null,
    finDate: null
  }

  public pages: number[] = [1];
  public currentPage: number = 1;

  private dcurrent = new Date();
  public dateStringIni = this.dcurrent.getFullYear() + '-' + String(this.dcurrent.getMonth() + 1).padStart(2, '0') + '-' + String(this.dcurrent.getDate()).padStart(2, '0');
  public dateStringFin = this.dcurrent.getFullYear() + '-' + String(this.dcurrent.getMonth() + 1).padStart(2, '0') + '-' + String(this.dcurrent.getDate()).padStart(2, '0');
  public noValidDateIni = false;
  public noValidDateMsgIni = "";
  public noValidDateFin = false;
  public noValidDateMsgFin = "";

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

    this._httpService.getAllBranches().subscribe((branches: Branch[]) => {

      this.filterParams.branchId = branches[0].id;

      // let itemAll: Branch[] = [];
      // itemAll.push({
      //   id: 0,
      //   name: "Todos",
      //   adress: "",
      //   is_deleted: "N",
      //   is_warehouse: "N"
      // });

      // this.branches = itemAll.concat(branches);
      this.branches = branches;
    });
  }

  findRepByDate(){
    this._httpService.getRepResidueOfBranch(this.filterParams).subscribe((repStockResidue: RepStockResidue[]) => {
      this.repStockResidue = repStockResidue;
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
        calc_by: "",
        kg_by_boxes: 0
      });

      products.sort((a, b) => (a.description > b.description) ? 1 : -1);

      this.products = itemAll.concat(products);
    })
  }

  onSubmit(f) {
    // if(f.invalid){
    //   return false;
    // }

    this.filterParams.meatType = f.value.meatType;
    this.filterParams.productId = f.value.product;
    this.filterParams.branchId = f.value.branch;
    this.filterParams.iniDate = this.dateStringIni;
    this.filterParams.finDate = this.dateStringFin;

    this.findRepByDate();
  }

  exportToPDF(){
    if(this.repStockResidue.length==0){
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'No hay registros para exportar',
        showConfirmButton: false,
        timer: 1500
      });

      return false;
    }
    // Fecha inicial: ${this.dateStringIni}, Fecha final: ${this.dateStringFin}`;
    let texto: string = `Scursal: ${this.branches.find(X=>X.id==this.filterParams.branchId).name}, Tipo de carne: ${this.meat_types.find(x=>x.id==this.filterParams.meatType).meat_name}, Tipo de producto: ${this.products.find(x=>x.id==this.filterParams.productId).description}`;

    const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape", format: 'letter'} );
    doc.text(texto,10,20);
    doc.table(10, 30, this.generateData(), this.headers, { autoSize: false });
    doc.save("totales_por_producto_almacen.pdf");
  }

  generateData() {
    let result = [];
    var data = {
      PRODUCTO:"",
      TIPO: "",
      KILOS: "",
      PIEZAS: "",
      CAJAS: "",
      MONTO: "",
      FECHA: ""
    };

    let MXpesos = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

    let totalAmountInput: number = 0;

    this.repStockResidue.forEach((item, index, array)=>{
      data.PRODUCTO = item.Product;
      data.TIPO = item.MeatType;

      if(item.KilogramsInput){
        data.KILOS = (item.KilogramsInput ?  item.KilogramsInput.toString() : "");
      }else{
        data.KILOS = " ";
      }

      if(item.PiecesInput){
        data.PIEZAS = (item.PiecesInput ?  item.PiecesInput.toString() : "");
      }else{
        data.PIEZAS = " ";
      }

      if(item.BoxesInput){
        data.CAJAS = (item.BoxesInput ?  item.BoxesInput.toString() : "");
      }else{
        data.CAJAS = " ";
      }

      data.MONTO = MXpesos.format(item.AmountInput);

      let dateStr = new Date(item.LastUpdate);
      data.FECHA = `${dateStr.getDate()}/${dateStr.getMonth()+1}/${dateStr.getFullYear()} ${dateStr.getHours()}:${dateStr.getMinutes()}:${dateStr.getSeconds()}`;

      totalAmountInput = Number(totalAmountInput) + Number(item.AmountInput);

      result.push(Object.assign({}, data));
    });

    data.PRODUCTO = "";
    data.TIPO = "";
    data.KILOS = "";
    data.PIEZAS = "";
    data.CAJAS = "";
    data.MONTO = "";
    data.FECHA = "";
    result.push(Object.assign({}, data));

    data.PRODUCTO = "TOTAL";
    data.TIPO = "====";
    data.KILOS = "====";
    data.PIEZAS = "====";
    data.CAJAS = "====";
    data.MONTO = MXpesos.format(totalAmountInput);
    data.FECHA = "====";
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
    {n: "KILOS", w: "50", a: "center"},
    {n: "PIEZAS", w: "50", a: "center"},
    {n: "CAJAS", w: "50", a: "center"},
    {n: "MONTO", w: "50", a: "center"},
    {n: "FECHA", w: "50", a: "center"}
  ]);

  getTotalInput():number{

    const totalInput = this.repStockResidue.reduce((accumulator, value) => {
      return Number(accumulator) + Number(value.AmountInput);
    }, 0);

    return totalInput;
  }

  // getTotalOutput():number{

  //   const totalOutput = this.repStockResidue.reduce((accumulator, value) => {
  //     return Number(accumulator) + Number(value.AmountOutput);
  //   }, 0);

  //   return totalOutput;
  // }

}
