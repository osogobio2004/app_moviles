import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../services/profile';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ProfileFormPage } from '../profile-form/profile-form.page';

interface Profile {
  proid: number;
  nickname: string;
  birthdate: string;
  avatar: string | null;
  couidfk: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.page.html',
  styleUrls: ['./profile-list.page.scss'],
  standalone: false,
})
export class ProfileListPage implements OnInit {
  profiles: Profile[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        nickname: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private profileService: ProfileService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadProfiles()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.profileService.total(this.busqueda));
    } catch (error) {
      console.error('Error al obtener el total:', error);
      this.total = 0;
    }
  }

  private ajustarPaginaActual(): void {
    const totalPaginas = Math.ceil(this.total / this.porPagina);
    if (totalPaginas === 0) {
      this.paginaActual = 1;
      return;
    }
    if (this.paginaActual > totalPaginas) {
      this.paginaActual = totalPaginas;
    }
  }

  async cambiarPagina(pagina: number): Promise<void> {
    this.paginaActual = pagina;
    await this.loadProfiles();
  }

  async loadProfiles(): Promise<void> {
    try {
      this.profiles = await firstValueFrom(
        this.profileService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.profiles = [];
    }
  }


  async newProfile(): Promise<void> {
    const modal = await this.modalController.create({
      component: ProfileFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editProfile(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: ProfileFormPage,
      componentProps: { proid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, nickname: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar perfil',
      message: `¿Estás seguro de eliminar el perfil de "${nickname}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarProfile(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarProfile(id: number): Promise<void> {
    try {
      await firstValueFrom(this.profileService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Perfil eliminado',
        message: 'El perfil fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar perfil:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el perfil. Verifica la conexión o dependencias.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
