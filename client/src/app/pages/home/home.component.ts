import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { empty } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public files;
  uploadedFiles: Array <File> ;
  public emptyFiles: boolean = false;

  constructor(private dataService: DataService, private modalService: NgbModal) { }

  getAllFiles() {
    this.dataService.getAllFiles().subscribe( result => {
      this.files = result['data'];
      if (this.files.length < 1 && !this.emptyFiles) {
        this.emptyFiles = true;
      } else {
        this.emptyFiles = false;
      }
    })
  }

  ngOnInit() {
    this.getAllFiles();
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  upload() {
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      this.dataService.uploadFile(this.uploadedFiles[i]).subscribe((data)=> {
        this.getAllFiles();
      })
    }       
  }

  remove(name) {
    this.dataService.removeFile(name).subscribe((result) => {
      console.log(result)
    })
    this.getAllFiles();
  }

  open(src, filename, img) {
    const modalRef = this.modalService.open(ModalComponent, { size: 'lg' });
    modalRef.componentInstance.src = src;
    modalRef.componentInstance.name = filename;
    modalRef.componentInstance.img = img;
  }

}
