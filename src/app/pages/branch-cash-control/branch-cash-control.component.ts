import { Component, OnInit } from '@angular/core';
import { HttpService, BranchHttpService, BranchCashControlHttpService }  from 'src/app/services';

import { Branch } from 'src/app/models/branch.model';
import { BranchCashControl } from 'src/app/models/brach-cash-control.model';
import { ProductSent } from 'src/app/models/product_sent.model';

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
  public dateOfCapture: string="";
  public branchName: string="";


  constructor(public _httpService: HttpService, public _branchHttpService: BranchHttpService, public _branchCashControlHttpService: BranchCashControlHttpService) { }

  ngOnInit() {

    this._branchHttpService.getBranches().subscribe((branches: Branch[]) => {
      this.branches = branches;

      let idLst = branches.map(a => a.id);
      this.collapsedBranchItemLst = new Array(Math.max(...idLst));

      branches.forEach((value) => {
        this.collapsedBranchItemLst[value.id] = true;
      });
    });

    let filterParams:any = {
      dateOfCapture: null,
      branchId: null,
      status: null
    }
    filterParams.dateOfCapture = "2024-02-22";
    this._branchCashControlHttpService.getFullBranchCashControl(filterParams).subscribe((branchCashControlLst: BranchCashControl[]) => {
      this.branchCashControlLst = branchCashControlLst;
    });




  }

  getEntryDetails(brachId, name, dateOfCapture){
    //buscar la lista de salidas envíadas y mostrarlo en pantalla
    let filterParams:any = {
      date: dateOfCapture,
      branchId: brachId
    }

    this._branchCashControlHttpService.getProductSentForBranch(filterParams).subscribe((productSentLst: ProductSent[]) => {
      this.productSentLst = productSentLst;
      this.branchName = name;
      this.dateOfCapture = dateOfCapture;
      this.openModal('entrysModal');
    });
  }

  getTotal():number{

    const sum = this.productSentLst.reduce((accumulator, value) => {
      return Number(accumulator) + Number(value.amount);
    }, 0);

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

}
