import { TestBed } from '@angular/core/testing';

import { ImagePreloadingService } from './image-preloading.service';

describe('ImagePreloadingService', () => {
  let service: ImagePreloadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagePreloadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
