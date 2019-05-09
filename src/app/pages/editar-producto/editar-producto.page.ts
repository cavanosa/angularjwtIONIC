import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.page.html',
  styleUrls: ['./editar-producto.page.scss'],
})
export class EditarProductoPage implements OnInit {

  form: any = {};
  actualizado = false;
  failActualizado = false;
  msjErr = '';
  msjOK = '';
  failInit = false;

  constructor(
    private productoService: ProductoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.productoService.detalle(id).subscribe( data => {
      this.form.nombreProducto = data.nombreProducto;
      this.form.precio = data.precio;
    },
      (err: any) => {
        this.failInit = true;
        this.router.navigate(['']);
      }
    );
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.productoService.editar(this.form, id).subscribe( data => {
      this.actualizado = true;
      this.failActualizado = false;
      this.msjOK = data.mensaje;
      this.presentToast();
    },
    (err: any) => {
      this.actualizado = false;
      this.failActualizado = true;
      this.msjErr = err.error.mensaje;
      this.presentAlert();
    }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Fail actualizando el producto',
      message: this.msjErr,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.msjOK,
      duration: 2000
    });
    toast.present();
  }

}
