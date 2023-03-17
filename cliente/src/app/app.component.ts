import { Component } from '@angular/core';
import { ImagenesService } from './imagenes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  imagenes: any[];
  images?: FileList;
  selectedImage?: File;

  constructor(private imagenesService: ImagenesService) {
    this.imagenes = [];
  }

  ImagenesSeleccionadas(event: any) {
    this.images = event.target.files;
  }

  ImagenSeleccionada(event: any) {
    this.selectedImage = event.target.files[0];
  }

  enviarMuchasImagenes() {
    if (!this.images || this.images.length === 0) {
      alert('No se seleccionaron imágenes');
      return;
    }
    this.imagenesService
      .SubirMuchasImagenes(this.images)
      .subscribe((response: any) => {
        this.obtenerImagenes();
      });
  }

  enviarUnaImagen() {
    if (!this.selectedImage) {
      alert('No se seleccionó una imagen');
      return;
    }
    this.imagenesService
      .SubirUnaImagen(this.selectedImage)
      .subscribe((response: any) => {
        this.obtenerImagenes();
      });
  }

  obtenerImagenes() {
    // Llamar al servicio para obtener todas las imágenes de la base de datos
    this.imagenesService.obtenerImagenes().subscribe(
      (response: any) => {
        console.log(response)
        this.imagenes = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
