import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {
  form: FormGroup;
  enviando = false;
  mensaje = '';

  constructor(
    fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.form = fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async registrar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    this.mensaje = '';
    try {
      await this.auth.registrar(this.form.value.email, this.form.value.password, this.form.value.nombre);
      this.mensaje = '¡Cuenta creada correctamente! Ya puedes iniciar sesión.';
      this.form.reset();

      const alerta = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada con éxito. Ahora puedes iniciar sesión.',
        buttons: [
          {
            text: 'Ir a Iniciar Sesión',
            handler: () => {
              void this.router.navigate(['/login']);
            }
          }
        ]
      });
      await alerta.present();
    } catch {
      this.mensaje = 'No fue posible completar el registro. Revisa los datos y la configuración de registro de Directus.';
    } finally {
      this.enviando = false;
    }
  }
}
