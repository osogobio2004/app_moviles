import { firstValueFrom } from 'rxjs';
import { TagService } from '../services/tag';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { TagFormPage } from '../tag-form/tag-form.page';

interface Tag {
  tagid: number;
  keyword: string;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.page.html',
  styleUrls: ['./tag-list.page.scss'],
  standalone: false,
})
export class TagListPage implements OnInit {
  tags: Tag[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        keyword: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private tagService: TagService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadTags()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.tagService.total(this.busqueda));
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
    await this.loadTags();
  }

  async loadTags(): Promise<void> {
    try {
      this.tags = await firstValueFrom(
        this.tagService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.tags = [];
    }
  }


  async newTag(): Promise<void> {
    const modal = await this.modalController.create({
      component: TagFormPage,
      breakpoints: [0, 0.4, 0.7],
      initialBreakpoint: 0.7
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editTag(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: TagFormPage,
      componentProps: { tagid: id },
      breakpoints: [0, 0.4, 0.7],
      initialBreakpoint: 0.7
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, keyword: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar etiqueta',
      message: `¿Estás seguro de eliminar la etiqueta "${keyword}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarTag(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarTag(id: number): Promise<void> {
    try {
      await firstValueFrom(this.tagService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Etiqueta eliminada',
        message: 'La etiqueta fue eliminada correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar etiqueta:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar la etiqueta. Podría estar asignada a recuerdos (label).',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
