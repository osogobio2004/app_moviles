import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../services/category';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { CategoryFormPage } from '../category-form/category-form.page';

interface Category {
  catid: number;
  name: string;
  color_hex: string;
  is_active: boolean | number;
  xp_value: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
  standalone: false,
})
export class CategoryListPage implements OnInit {
  categories: Category[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        name: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private categoryService: CategoryService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadCategories()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.categoryService.total(this.busqueda));
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
    await this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    try {
      this.categories = await firstValueFrom(
        this.categoryService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.categories = [];
    }
  }


  async newCategory(): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoryFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editCategory(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoryFormPage,
      componentProps: { catid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, name: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar categoría',
      message: `¿Estás seguro de eliminar la categoría "${name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarCategory(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarCategory(id: number): Promise<void> {
    try {
      await firstValueFrom(this.categoryService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Categoría eliminada',
        message: 'La categoría fue eliminada correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar la categoría. Verifica si existen misiones asociadas.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
