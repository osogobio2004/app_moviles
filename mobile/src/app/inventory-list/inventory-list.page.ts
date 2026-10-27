import { firstValueFrom } from 'rxjs';
import { InventoryService } from '../services/inventory';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { InventoryFormPage } from '../inventory-form/inventory-form.page';

interface InventoryItem {
  invid: number;
  acquired_at: string;
  is_equipped: number | boolean;
  couidfk: number;
  rewidfk: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.page.html',
  styleUrls: ['./inventory-list.page.scss'],
  standalone: false,
})
export class InventoryListPage implements OnInit {
  items: InventoryItem[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? { search: texto } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private inventoryService: InventoryService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadInventory()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.inventoryService.total(this.busqueda));
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
    await this.loadInventory();
  }

  async loadInventory(): Promise<void> {
    try {
      this.items = await firstValueFrom(
        this.inventoryService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.items = [];
    }
  }


  async newInventory(): Promise<void> {
    const modal = await this.modalController.create({
      component: InventoryFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editInventory(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: InventoryFormPage,
      componentProps: { invid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar ítem',
      message: `¿Estás seguro de eliminar el ítem de inventario #${id}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarInventory(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarInventory(id: number): Promise<void> {
    try {
      await firstValueFrom(this.inventoryService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Ítem eliminado',
        message: 'El ítem fue eliminado correctamente del inventario.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar inventario:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el ítem del inventario.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
