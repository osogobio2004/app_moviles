import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Memory, MemoryService } from '../services/memory';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-memory-view',
  templateUrl: './memory-view.page.html',
  styleUrls: ['./memory-view.page.scss'],
  standalone: false
})
export class MemoryViewPage implements OnInit {
  memory: Memory | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private memoryService: MemoryService
  ) {}

  ngOnInit(): void {
    this.loadMemory();
  }

  ionViewWillEnter(): void {
    this.loadMemory();
  }

  async loadMemory(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.memory = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del recuerdo.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando recuerdo...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.memory = await firstValueFrom(this.memoryService.detalle(id));
    } catch (error) {
      console.error('Error al cargar el recuerdo:', error);
      this.errorMessage = 'No fue posible cargar el recuerdo. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }

  abrirPagina(): void {
    if (!this.memory) return;
    const url = `${environment.apiUrl}/items/memory/${this.memory.memid}?fields=*,tags.labid,tags.tagidfk.tagid,tags.tagidfk.keyword`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
