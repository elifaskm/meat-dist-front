import { Component, OnInit } from '@angular/core';
import { HttpService, BranchHttpService, BranchCashControlHttpService }  from 'src/app/services';

import { Branch } from 'src/app/models/branch.model';
import { BranchCashControl } from 'src/app/models/brach-cash-control.model';

@Component({
  selector: 'app-inputs-outputs',
  templateUrl: './branch-cash-control.component.html',
  styleUrls: ['./branch-cash-control.component.scss']
})
export class BranchCashControlComponent implements OnInit {

  public branches: Branch[];
  public branchCashControlLst: BranchCashControl[];

  public collapsedBranchItemLst: any[];

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

}
