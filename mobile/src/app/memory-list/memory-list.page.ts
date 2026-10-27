import { firstValueFrom } from 'rxjs';
import { Memory, MemoryService } from '../services/memory';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { MemoryFormPage } from '../memory-form/memory-form.page';

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-memory-list',
  templateUrl: './memory-list.page.html',
  styleUrls: ['./memory-list.page.scss'],
  standalone: false,
})
export class MemoryListPage implements OnInit {
  memories: Memory[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        note: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private memoryService: MemoryService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadMemories()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.memoryService.total(this.busqueda));
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
    await this.loadMemories();
  }

  async loadMemories(): Promise<void> {
    try {
      this.memories = await firstValueFrom(
        this.memoryService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.memories = [];
    }
  }


  async newMemory(): Promise<void> {
    const modal = await this.modalController.create({
      component: MemoryFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editMemory(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: MemoryFormPage,
      componentProps: { memid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, note: string): Promise<void> {
    const preview = note.length > 30 ? note.substring(0, 30) + '...' : note;
    const alerta = await this.alertController.create({
      header: 'Eliminar recuerdo',
      message: `¿Estás seguro de eliminar el recuerdo "${preview}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarMemory(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarMemory(id: number): Promise<void> {
    try {
      await firstValueFrom(this.memoryService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Recuerdo eliminado',
        message: 'El recuerdo fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar recuerdo:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el recuerdo. Revisa la conexión y las relaciones del registro.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
