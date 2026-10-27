import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import { AuthService } from './auth';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Step {
  steid: number;
  instruction: string;
  order_num: number;
  is_done: number | boolean;
  misidfk: number;
}

@Injectable({ providedIn: 'root' })
export class StepService {
  constructor(private auth: AuthService) {}
  private url = environment.apiUrl + '/items/step';

  private filtro(busqueda: string): Record<string, string> {
    const texto = busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        instruction: { _icontains: texto }
      })
    } : {};
  }

  listado(pagina = 1, porPagina = 10, busqueda = ''): Observable<any[]> {
    return defer(() => this.auth.cliente.get<{ data: any[] }>(this.url, {
      params: {
        page: pagina,
        limit: porPagina,
        sort: 'steid',
        ...this.filtro(busqueda)
      }
    })).pipe(map(response => response.data.data));
  }

  detalle(id: number | string): Observable<any> {
    return defer(() => this.auth.cliente.get<{ data: any }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  crear(item: any): Observable<any> {
    return defer(() => this.auth.cliente.post<{ data: any }>(this.url, item, {
      headers: { 'Content-Type': 'application/json' }
    })).pipe(map(response => response.data.data));
  }

  actualizar(id: number | string, item: any): Observable<any> {
    return defer(() => this.auth.cliente.patch<{ data: any }>(this.url + '/' + id, item, {
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
