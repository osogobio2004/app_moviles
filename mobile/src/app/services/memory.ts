import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import { AuthService } from './auth';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface TagLink {
  labid: number;
  tagidfk: {
    tagid: number;
    keyword: string;
  };
}

export interface Memory {
  memid: number;
  note: string;
  captured_at: string;
  favorite: number | boolean;
  couidfk: number;
  tags?: TagLink[];
}

export interface MemoryGuardar {
  note: string;
  captured_at: string;
  favorite: number;
  couidfk: number;
  tags?: { tagidfk: number }[] | { create: { tagidfk: number }[]; delete: number[] };
}

@Injectable({ providedIn: 'root' })
export class MemoryService {
  constructor(private auth: AuthService) {}
  private url = environment.apiUrl + '/items/memory';

  private filtro(busqueda: string): Record<string, string> {
    const texto = busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        note: { _icontains: texto }
      })
    } : {};
  }

  listado(pagina = 1, porPagina = 10, busqueda = ''): Observable<Memory[]> {
    return defer(() => this.auth.cliente.get<{ data: Memory[] }>(this.url, {
      params: {
        page: pagina,
        limit: porPagina,
        sort: '-memid',
        ...this.filtro(busqueda)
      }
    })).pipe(map(response => response.data.data));
  }

  detalle(id: number | string): Observable<Memory> {
    return defer(() => this.auth.cliente.get<{ data: Memory }>(this.url + '/' + id, {
      params: { fields: '*,tags.labid,tags.tagidfk.tagid,tags.tagidfk.keyword' }
    })).pipe(map(response => response.data.data));
  }

  crear(item: MemoryGuardar): Observable<Memory> {
    return defer(() => this.auth.cliente.post<{ data: Memory }>(this.url, item, {
      headers: { 'Content-Type': 'application/json' }
    })).pipe(map(response => response.data.data));
  }

  actualizar(id: number | string, item: MemoryGuardar): Observable<Memory> {
    return defer(() => this.auth.cliente.patch<{ data: Memory }>(this.url + '/' + id, item, {
      headers: { 'Content-Type': 'application/json' }
    })).pipe(map(response => response.data.data));
  }

  eliminar(id: number | string): Observable<void> {
    return defer(() => this.auth.cliente.delete(this.url + '/' + id)).pipe(map(() => undefined));
  }

  total(busqueda = ''): Observable<number> {
    return defer(() => this.auth.cliente.get<{ data: { count: string | number }[] }>(this.url, {
      params: { 'aggregate[count]': '*', ...this.filtro(busqueda) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }
}
