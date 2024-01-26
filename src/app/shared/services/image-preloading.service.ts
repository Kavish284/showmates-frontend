import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagePreloadingService {

  private isFirstTimeLoad = true;
  private eventDetailsBannerLoaded=true;

  setNotFirstTimeLoad() {
    this.isFirstTimeLoad = false;
  }

  get isFirstLoad(): boolean {
    return this.isFirstTimeLoad;
  }

  get isEventDetailsPageBannerLoadedFirstTime(): boolean {
    return this.eventDetailsBannerLoaded;
  }
  setNotFirstTimeLoadEventdetailsBanner() {
    this.eventDetailsBannerLoaded = false;
  }

  preloadImages(images: string[]): Promise<HTMLImageElement[]> {
    const promises: Promise<HTMLImageElement>[] = [];

    images.forEach((imageUrl) => {
      const image = new Image();
      promises.push(
        new Promise<HTMLImageElement>((resolve, reject) => {
          image.onload = () => {
            resolve(image);
          };
          image.onerror = () => {
            console.error(`Failed to preload image: ${imageUrl}`);
            resolve(image); // Continue preloading other images even if one fails
          };
          image.src = imageUrl;
        })
      );
    });

    return Promise.all(promises);
  }
}
