import {
  ApplicationRef, ComponentRef, ElementRef,
  Injector, Type, createComponent,
} from '@angular/core';

export class AngularRenderer<C, P> {
  private applicationRef: ApplicationRef;
  private componentRef: ComponentRef<C>;

  constructor(ViewComponent: Type<C>, injector: Injector, props: Partial<P>) {
    this.applicationRef = injector.get(ApplicationRef);

    this.componentRef = createComponent(ViewComponent, {
      environmentInjector: this.applicationRef.injector,
    });

    // set input props to the component
    this.updateProps(props);

    this.applicationRef.attachView(this.componentRef.hostView);
  }

  get instance(): C {
    return this.componentRef.instance;
  }

  get elementRef(): ElementRef {
    return this.componentRef.injector.get(ElementRef);
  }

  get dom(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  updateProps<T extends P>(props: Partial<T>): void {
    Object.entries(props).forEach(([key, value]) => {
      this.instance[key as keyof C] = value as C[keyof C];
    });
  }

  detectChanges(): void {
    this.componentRef.changeDetectorRef.detectChanges();
  }

  destroy(): void {
    this.componentRef.destroy();
    this.applicationRef.detachView(this.componentRef.hostView);
  }
}
