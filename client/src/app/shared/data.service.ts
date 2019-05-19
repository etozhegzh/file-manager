import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getAllFiles() {
    return this.http.post('/api/files/getAllFiles', {});
  }

  removeFile(value) {
    return this.http.post('/api/files/remove', { name: value });
  }

  uploadFile(file) {
    let formData = new FormData();    
    formData.append('upload', file);

    return this.http.post('/api/files/addFile', formData);
  }

  getTextFile(name) {
    return this.http.get('http://localhost:3000/' + name, { responseType: 'text' });
  }
}
