import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../services/category';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface CategoryDetail {
  catid: number;
  name: string;
  color_hex: string;
  is_active: boolean | number;
  xp_value: number;
}

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.page.html',
  styleUrls: ['./category-view.page.scss'],
  standalone: false
})
export class CategoryViewPage implements OnInit {
  category: CategoryDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategory();
  }

  async loadCategory(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.category = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador de la categoría.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando categoría...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.category = await firstValueFrom(this.categoryService.detalle(id));
    } catch (error) {
      console.error('Error al cargar la categoría:', error);
      this.errorMessage = 'No fue posible cargar la categoría. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
