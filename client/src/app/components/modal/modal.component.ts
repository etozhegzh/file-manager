import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnInit {

  @Input() src;
  @Input() name;
  @Input() img;
  text;

  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }

  ngOnInit() {
    
    if(!this.img) {
      this.getTextFile(this.name);
    }

  }

  getTextFile(name) {
    this.dataService.getTextFile(this.name).subscribe(data => {
      this.text = data; 
    });
  }

}
