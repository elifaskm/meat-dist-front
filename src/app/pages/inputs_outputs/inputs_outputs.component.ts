import { Component, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { InputsOutputs } from "src/app/models/inputs_outputs.model";

@Component({
  selector: 'app-inputs-outputs',
  templateUrl: './inputs_outputs.component.html',
  styleUrls: ['./inputs_outputs.component.scss']
})
export class InputsOutputsComponent implements OnInit {
  public inputsOutputs: InputsOutputs[];
  public pageSize: number = 10;
  public pageNum: number = 0

  constructor(public _httpService: HttpService) { }

  ngOnInit() {
    this._httpService.getInputsOutputs(this.pageSize, this.pageNum).subscribe((inputsOutputs: InputsOutputs[]) => {
      this.inputsOutputs = inputsOutputs;
    });
  }

}
