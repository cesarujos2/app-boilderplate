import { Injectable, signal, Signal } from '@angular/core';

type MediaQueryMap = Record<string, Signal<boolean>>;

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {
  private queries: MediaQueryMap = {};

  match(query: string): Signal<boolean> {
    if (!this.queries[query]) {
      const media = window.matchMedia(query);
      const state = signal(media.matches);
      media.addEventListener('change', e => state.set(e.matches));
      this.queries[query] = state;
    }

    return this.queries[query];
  }
}
