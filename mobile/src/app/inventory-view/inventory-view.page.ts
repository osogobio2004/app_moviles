import { firstValueFrom } from 'rxjs';
import { InventoryService } from '../services/inventory';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface InventoryDetail {
  invid: number;
  acquired_at: string;
  is_equipped: number | boolean;
  couidfk: number;
  rewidfk: number;
}

@Component({
  selector: 'app-inventory-view',
  templateUrl: './inventory-view.page.html',
  styleUrls: ['./inventory-view.page.scss'],
  standalone: false
})
export class InventoryViewPage implements OnInit {
  inventory: InventoryDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  async loadInventory(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.inventory = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del ítem en inventario.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando ítem...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.inventory = await firstValueFrom(this.inventoryService.detalle(id));
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      this.errorMessage = 'No fue posible cargar el ítem. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
