import { EventDetailsResp } from './data-provider.service';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService implements OnInit {

  private editId:number;
  private model:EventDetailsResp;
  constructor() { 

  }
  ngOnInit(): void {
    
  }
  set Model(model:EventDetailsResp){
    this.model=model;
  }
  get Model(){
    return this.model;
  }
}
