import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImagenesService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  SubirUnaImagen(image: File) {

    const formData = new FormData();
    formData.append('image', image); // file es la variable que contiene el archivo a subir
    return this.http.post(`${this.apiUrl}/upload`, formData)
  }

  SubirMuchasImagenes (images: FileList) {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    return this.http.post(`${this.apiUrl}/upload-multiple`, formData);
  }

  obtenerImagenes() {
    return this.http.get(`${this.apiUrl}/imagenes`);
  }
}
