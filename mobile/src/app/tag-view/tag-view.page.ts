import { firstValueFrom } from 'rxjs';
import { TagService } from '../services/tag';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface TagDetail {
  tagid: number;
  keyword: string;
}

@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.page.html',
  styleUrls: ['./tag-view.page.scss'],
  standalone: false
})
export class TagViewPage implements OnInit {
  tag: TagDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private tagService: TagService) {}

  ngOnInit(): void {
    this.loadTag();
  }

  async loadTag(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.tag = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador de la etiqueta.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando etiqueta...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.tag = await firstValueFrom(this.tagService.detalle(id));
    } catch (error) {
      console.error('Error al cargar la etiqueta:', error);
      this.errorMessage = 'No fue posible cargar la etiqueta. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
