import { Component, OnInit } from '@angular/core';
import { HttpService, BranchHttpService, BranchCashControlHttpService }  from 'src/app/services';

import { Branch } from 'src/app/models/branch.model';
import { BranchCashControl } from 'src/app/models/brach-cash-control.model';
import { ProductSent } from 'src/app/models/product_sent.model';
import { Configuration } from 'src/app/models/configuration.model';
import { ResponseModel } from 'src/app/models/response.model';
import { log } from 'console';

@Component({
  selector: 'app-inputs-outputs',
  templateUrl: './branch-cash-control.component.html',
  styleUrls: ['./branch-cash-control.component.scss']
})
export class BranchCashControlComponent implements OnInit {

  public branches: Branch[];
  public branchCashControlLst: BranchCashControl[];
  public productSentLst: ProductSent[] = [];
  public collapsedBranchItemLst: any[];
  public isCollapsedAll:boolean=true;
  public semaphoreConf: any;

  public dateOfCapture: string = "";
  public branchName: string = "";
  public totalSales: number = 0;
  public previousResidue: number = 0;
  public calcEntry: number = 0;
  public selled: number = 0;
  public residue: number = 0;
  public productSentId: number = 0;

  public newResidue: number = 0;
  public newSelled: number = 0;

  public noValidDate = false;
  public noValidDateMsg = "";

  public noValidAmount = false;
  public noValidAmountMsg = "";
  public noValidBoxes = false;
  public noValidBoxesMsg = "";
  public noValidPieces = false;
  public noValidPiecesMsg = "";
  public noValidKilograms = false;
  public noValidKilogramsMsg = "";
  public noValidResidue = false;
  public noValidSelled = false;
  public noValidResidueMsg = "";

  public disabledKilograms = false;
  public disabledPieces = false;
  public disabledBoxes = false;

  public filterParams:any = {
    dateOfCapture: null,
    branchId: null,
    status: null
  }

  public editProductSent = false;
  public productSentToEdit : ProductSent;
  public branchCashControlToEdit : BranchCashControl;

  private dcurrent = new Date();
  public dateFilterString = this.dcurrent.getFullYear() + '-' + String(this.dcurrent.getMonth() + 1).padStart(2, '0') + '-' + String(this.dcurrent.getDate()).padStart(2, '0');

  public editResidue = false;
  public editSelled = false;

  constructor(public _httpService: HttpService, public _branchHttpService: BranchHttpService, public _branchCashControlHttpService: BranchCashControlHttpService) { }

  ngOnInit() {



    this._branchHttpService.getBranches().subscribe((branches: Branch[]) => {
      this.filterParams.branchId = 0;
      let arrayAllItem = [];
      let allItem : Branch = {
        id: 0,
        name: "-- Todas --",
        adress: "",
        is_deleted: "N",
        is_warehouse: "N",
      }
      arrayAllItem.push(allItem);
      this.branches = arrayAllItem.concat(branches);

      let idLst = branches.map(a => a.id);
      this.collapsedBranchItemLst = new Array(Math.max(...idLst));

      branches.forEach((value) => {
        this.collapsedBranchItemLst[value.id] = true;
      });
    });

    this._httpService.getConfigurationByKey("SEMAPHORE").subscribe((configuration: Configuration) => {
      this.semaphoreConf = JSON.parse(configuration.value);

      this.filterParams.dateOfCapture = this.dateFilterString;
      this.getBranchCashControlLst();
    });

  }

  getGDriveFilesData(){
    this._branchCashControlHttpService.getDriveFilesData().subscribe((resp: ResponseModel) => {
      //if (resp!=="OK"){
        console.log(resp.msg);
      //}
    });
  }

  getBranchCashControlLst(){

    this._branchCashControlHttpService.getFullBranchCashControl(this.filterParams).subscribe((branchCashControlLst: BranchCashControl[]) => {

      branchCashControlLst.forEach((value) => {
        const diffEntry = value.entry - value.calcEntry;

        if(diffEntry<=this.semaphoreConf.green.lessthanorequal){
          value.semaphoreEntry = "green";
        }else if(diffEntry>this.semaphoreConf.yellow.greaterthan && diffEntry<this.semaphoreConf.yellow.lessthan){
          value.semaphoreEntry = "yellow";
        }else if(diffEntry>=this.semaphoreConf.red.greaterthanorequal){
          value.semaphoreEntry = "red";
        }

        const diffSales = value.selled - (value.previousResidue + value.calcEntry - value.residue);

        if(diffSales<=this.semaphoreConf.green.lessthanorequal){
          value.semaphoreSales = "green";
        }else if(diffSales>this.semaphoreConf.yellow.greaterthan && diffSales<this.semaphoreConf.yellow.lessthan){
          value.semaphoreSales = "yellow";
        }else if(diffSales>=this.semaphoreConf.red.greaterthanorequal){
          value.semaphoreSales = "red";
        }

        const diffResidue = value.selled - (value.previousResidue + value.calcEntry - value.residue);

        if(diffResidue<=this.semaphoreConf.green.lessthanorequal){
          value.semaphoreResidue = "green";
        }else if(diffResidue>this.semaphoreConf.yellow.greaterthan && diffResidue<this.semaphoreConf.yellow.lessthan){
          value.semaphoreResidue = "yellow";
        }else if(diffResidue>=this.semaphoreConf.red.greaterthanorequal){
          value.semaphoreResidue = "red";
        }

      });

      this.branchCashControlLst = branchCashControlLst;
    });
  }


  getEntryDetails(branchId, name, dateOfCapture){
    //buscar la lista de salidas envíadas y mostrarlo en pantalla
    let filterParams:any = {
      date: dateOfCapture,
      branchId: branchId
    }

    this._branchCashControlHttpService.getProductSentForBranch(filterParams).subscribe((productSentLst: ProductSent[]) => {
      this.productSentLst = productSentLst;
      this.branchName = name;
      this.dateOfCapture = dateOfCapture;
      this.openModal('entrysModal');
    });
  }

  getSalesDetails(branchId, previousResidue, calcEntry, name, dateOfCapture, residue, selled, productSentId){
    let filterParams:any = {
      date: dateOfCapture,
      branchId: branchId
    }

    this._branchCashControlHttpService.getProductSentForBranch(filterParams).subscribe((productSentLst: ProductSent[]) => {
      this.productSentLst = productSentLst;
      this.branchName = name;
      this.dateOfCapture = dateOfCapture;
      this.previousResidue = previousResidue;
      this.calcEntry = calcEntry;
      this.residue = residue;
      this.selled = selled;
      this.productSentId = productSentId;

      this.openModal('salesModal');
    });
  }

  getResidueDetails(branchId, previousResidue, calcEntry, name, dateOfCapture, selled, residue){
    let filterParams:any = {
      date: dateOfCapture,
      branchId: branchId
    }

    this._branchCashControlHttpService.getProductSentForBranch(filterParams).subscribe((productSentLst: ProductSent[]) => {
      this.productSentLst = productSentLst;
      this.branchName = name;
      this.dateOfCapture = dateOfCapture;
      this.previousResidue = previousResidue;
      this.calcEntry = calcEntry;
      this.selled = selled;
      this.residue = residue;



      this.openModal('residueModal');
    });
  }

  getTotalEntrys():number{

    const sum = this.productSentLst.reduce((accumulator, value) => {
      return Number(accumulator) + Number(value.amount);
    }, 0);

    return sum;
  }

  getTotalSales():number{
    const sum = (this.previousResidue + this.calcEntry) - this.residue;
    return sum;
  }

  getTotalResidue():number{
    const sum = (this.previousResidue + this.calcEntry) - this.selled;
    return sum;
  }

  enableEditEntryDetail(){
    //debe habilitar el campo para editar el dato
  }

  saveEditedEntryDetail(){
    //guardar dato nuevo al dar enter
  }

  openModal(divId){
    const modelDiv = document.getElementById(divId);
    if(modelDiv != null){
      modelDiv.style.display = 'block';
    }
  }

  closeModal(divId){
    const modelDiv = document.getElementById(divId);
    if(modelDiv != null){
      modelDiv.style.display = 'none';
    }
  }

  onSubmit(f) {

    if(f.controls.dateIFilter.errors && f.controls.dateIFilter.errors.required){
      this.noValidDateMsg = "Se requiere la Fecha";
      this.noValidDate=true;
      return;
    }
    this.noValidDate=false;

    this.filterParams.dateOfCapture = this.dateFilterString;
    if(f.value.branchId == 0){
      this.filterParams.branchId = null;
    }
    this.filterParams.status = f.value.estatusFilter ;

  //aqui va el consumo de la api
  this.getGDriveFilesData();

    this.getBranchCashControlLst();
 }

 collapsedAll(b:boolean){
  for(let i=0; i<this.collapsedBranchItemLst.length; i++){
    this.collapsedBranchItemLst[i] = b;
  }

  this.isCollapsedAll = b;
 }

//  Productos enviados
 openEditProductSent(id, selled, residue){
  //obtener datos de registro
  this.productSentToEdit = this.productSentLst.find(x=>x.id==id);

  this.disabledBoxes = this.productSentToEdit.boxes == null;
  this.disabledKilograms = this.productSentToEdit.kilograms == null;
  this.disabledPieces = this.productSentToEdit.pieces == null;

  //ceder datos a formulario
  this.branchCashControlToEdit = null;
  this.editProductSent=true;
 }

 openEditResidue(){
  this.newResidue = this.residue;
  this.editResidue=true;
 }

 openEditSelled(){
  this.newSelled = this.selled;
  this.editSelled = true;
 }

 onSubmitEditProductSent(f) {

  if(f.invalid){
    this.validatePieces(f);
    this.validateBoxes(f);
    this.validateAmount(f);
    this.validateKilograms(f);

    return false;
  }

  this.noValidKilograms=false;
  this.noValidPieces = false;
  this.noValidBoxes = false;
  this.noValidAmount = false;

  //llamar a setear valores en lista y que se refeleje en grid
  let objIndex = this.productSentLst.findIndex(x=>x.id==this.productSentToEdit.id);
  this.productSentLst[objIndex] = this.productSentToEdit;

  this.editProductSent=false;


}

onSubmitEditResidue(f) {

    if(f.invalid){
      this.validateResidue(f);

      return false;
    }

    this.noValidResidue = false;

    this.editResidue = false;

    this.residue = this.newResidue;

    //guardar cambios
    this.SaveBranchCashControl("R",this.residue);
  }

  validateResidue(f) {
    if(f.controls.newResidue.errors && f.controls.newResidue.errors.required){
      this.noValidResidueMsg = "Este campo es requerido";
      this.noValidResidue = true;
      return;
    }
    if(f.controls.newResidue.errors && f.controls.renewResidueidue.errors.min){
      this.noValidResidueMsg = "El valor mínimo es cero";
      this.noValidResidue = true;
      return;
    }

    this.noValidResidue = false;
    return;
  }

  onSubmitEditSelled(f) {

    if(f.invalid){
      this.validateSelled(f);

      return false;
    }

    this.noValidSelled = false;

    this.editSelled= false;

    this.selled = this.newSelled;

    //guardar cambios
    this.SaveBranchCashControl("S",this.selled);
  }

  validateSelled(f) {
    if(f.controls.newResidue.errors && f.controls.newResidue.errors.required){
      this.noValidResidueMsg = "Este campo es requerido";
      this.noValidResidue = true;
      return;
    }
    if(f.controls.newResidue.errors && f.controls.renewResidueidue.errors.min){
      this.noValidResidueMsg = "El valor mínimo es cero";
      this.noValidResidue = true;
      return;
    }

    this.noValidResidue = false;
    return;
  }

validateKilograms(f) {
  if(f.controls.kilograms.errors && f.controls.kilograms.errors.required){
    this.noValidKilogramsMsg = "Este campo es requerido";
    this.noValidKilograms=true;
    return;
  }
  if(f.controls.pieces.errors && f.controls.pieces.errors.min){
    this.noValidKilogramsMsg = "El valor debe ser mayor a cero";
    this.noValidKilograms=true;
    return;
  }

  this.noValidKilograms = false;
  return;
}

validatePieces(f) {
  if(f.controls.pieces.errors && f.controls.pieces.errors.required){
    this.noValidPiecesMsg = "Este campo es requerido";
    this.noValidPieces=true;
    return;
  }
  if(f.controls.pieces.errors && f.controls.pieces.errors.min){
    this.noValidPiecesMsg = "El valor debe ser mayor a cero";
    this.noValidPieces=true;
    return;
  }

  this.noValidPieces = false;
  return;
}

validateBoxes(f) {
  if(f.controls.boxes.errors && f.controls.boxes.errors.required){
    this.noValidBoxesMsg = "Este campo es requerido";
    this.noValidBoxes=true;
    return;
  }
  if(f.controls.boxes.errors && f.controls.boxes.errors.min){
    this.noValidBoxesMsg = "El valor debe ser mayor a cero";
    this.noValidBoxes=true;
    return;
  }

  this.noValidBoxes = false;
  return;
}

validateAmount(f) {
  if(f.controls.amount.errors && f.controls.amount.errors.required){
    this.noValidAmountMsg = "Este campo es requerido";
    this.noValidAmount=true;
    return;
  }
  if(f.controls.amount.errors && f.controls.amount.errors.min){
    this.noValidAmountMsg = "El valor debe ser mayor a cero";
    this.noValidAmount=true;
    return;
  }

  this.noValidAmount = false;
  return;
}

cleanErrorMsgs(){
  this.noValidAmount = false;
  this.noValidAmountMsg = "";
  this.noValidBoxes = false;
  this.noValidBoxesMsg = "";
  this.noValidPieces = false;
  this.noValidPiecesMsg = "";
  this.noValidKilograms = false;
  this.noValidKilogramsMsg = "";
}

CambiarEstatus(checked, id){
  //buscar con el id
  this._branchCashControlHttpService.getBranchCashControlById(id).subscribe((branchCashControl: BranchCashControl) => {
    if(checked){
      branchCashControl.status = "R";
    }else{
      branchCashControl.status = "P";
    }

    this._branchCashControlHttpService.patchBranchCashControl(id, branchCashControl).subscribe((branchCashControl: BranchCashControl) => {
      console.log("OK");
    });
  });

  //update estatus y updated
}

//inicio guardar saldo
SaveBranchCashControl(key, value){
  //buscar con el id
  this._branchCashControlHttpService.getBranchCashControlById(this.productSentId).subscribe((branchCashControl: BranchCashControl) => {
    if(key==="R"){
      branchCashControl.residue = value;
    }else{
      branchCashControl.selled = value;
    }

    this._branchCashControlHttpService.patchBranchCashControl(this.productSentId, branchCashControl).subscribe((branchCashControl: BranchCashControl) => {
      this.getBranchCashControlLst();
    });
  });

  //update estatus y updated
}
//fin guardar saldo

}
