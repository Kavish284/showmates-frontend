import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loaderDisplayedKey = 'loaderDisplayed';

  shouldDisplayLoader(): boolean {
    const hasLoaderBeenDisplayed = localStorage.getItem(this.loaderDisplayedKey);
    return !hasLoaderBeenDisplayed;
  }

  setLoaderDisplayedFlag(): void {
    localStorage.setItem(this.loaderDisplayedKey, 'true');
  }
}
