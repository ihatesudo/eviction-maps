import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import { PlatformService } from './platform.service';


@Injectable()
export class ScrollService {
  defaultScrollOffset = 120;
  defaultDuration = 1000;
  // Easing function pulled from:
  // https://joshondesign.com/2013/03/01/improvedEasingEquations
  defaultEasingLogic = {
    ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
  };
  /**
   * Setting position fixed on body will prevent scroll, and setting overflow
   * to scroll ensures the scrollbar is always visible.
   * IE 11 requires an empty string rather than null to unset styles.
   */
  set allowScroll(val: boolean) {
    const changeScroll = !val && this.document.documentElement.scrollTop === 0;
    this.document.body.style.position = changeScroll ? 'fixed' : '';
    this.document.body.style.overflowY = changeScroll ? 'scroll' : '';
  }
  verticalOffset$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private platform: PlatformService,
    private pageScroll: PageScrollService
  ) {
    // provide observable with top / bottom vertical offset
    this.verticalOffset$ = Observable
      .fromEvent(this.platform.nativeWindow, 'scroll')
      .map(e => this.getVerticalOffset());
  }

  /**
   * Sets up PageScrollConfig with defaults
   */
  setupScroll() {
    PageScrollConfig.defaultScrollOffset = this.defaultScrollOffset;
    PageScrollConfig.defaultDuration = this.defaultDuration;
    PageScrollConfig.defaultEasingLogic = this.defaultEasingLogic;
  }

  /**
   * Helper method for scrolling to an element on the page
   * @param selector Query selector for element to scroll to
   */
  scrollTo(selector: string) {
    const scrollInstance = PageScrollInstance.simpleInstance(this.document, selector);
    this.pageScroll.start(scrollInstance);
  }

  private getVerticalOffset() {
    return this.platform.nativeWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop || 0;
  }
}
