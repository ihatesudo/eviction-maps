import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  isLoading = false;
  private loadingItems = [];
  private loadingStore = {};
  private _debug = true;

  constructor() { }

  /**
   * Triggers loading to start for a given identifier
   */
  start(id: string, data?:any) {
    this.debug('loading start', id, data);
    this.isLoading = true;
    if (this.loadingItems.indexOf(id) === -1) {
      this.loadingItems.push(id);
    }
  }

  /**
   * Marks an identifier as done loading, sets loading status to false if
   * no more items are left to load.
   */
  end(id: string, data?:any) {
    this.debug('loading end', id, data);
    this.loadingItems = this.loadingItems.filter(itemId => itemId !== id);
    this.isLoading = !(this.loadingItems.length === 0);
  }

  private debug(...args) {
    this._debug ? console.debug.apply(console, args) : null;
  }

}
