import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

import { GridEventType, KcGridItem } from '../../types';
import { KcGridService } from '../../services';
import { PreviewDirective } from '../preview/preview.directive';

@Directive({
  selector: '[kcGridPreviewStyle]',
})
export class PreviewStyleDirective implements OnChanges {
  @Input({ required: true }) item!: KcGridItem;
  @Input({ required: true }) event!: GridEventType;
  @Input({ required: true }) scale!: number;

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  protected _grid = inject(KcGridService);

  private _preview = inject(PreviewDirective);

  ngOnChanges() {
    this._updateStyle();

    if (this.event === GridEventType.Release) setTimeout(() => this._preview.destroy(), 300);
    // enable animation only on capture and after update style to prevent animation from x: 0, y: 0 to the new position
    else if (this.event === GridEventType.Capture) requestAnimationFrame(() => this._addAnimation());
  }

  private _addAnimation(): void {
    this.elementRef.nativeElement.style.transition = '300ms';
    this.elementRef.nativeElement.style.transitionTimingFunction = 'ease';
  }

  private _updateStyle(): void {
    if (this.item.rows === 0 || this.item.cols === 0) return;

    this.elementRef.nativeElement.style.width = this._widthValue();
    this.elementRef.nativeElement.style.height = this._heightValue();
    this.elementRef.nativeElement.style.transform = this._transformValue();
  }

  private _transformValue(): string {
    const gapsWidth = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsHeight = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const untilGapsWidth = this._grid.colsGaps.slice(0, this.item.col).reduce((acc, gap) => acc + gap, 0);
    const untilGapsHeight = this._grid.rowsGaps.slice(0, this.item.row).reduce((acc, gap) => acc + gap, 0);

    const x = this.item.col / this._grid.cols;
    const y = this.item.row / this._grid.rows;

    const translateX = `calc((100cqw - ${gapsWidth}px) * ${x} + ${untilGapsWidth}px)`;
    const translateY = `calc((100cqh - ${gapsHeight}px) * ${y} + ${untilGapsHeight}px)`;

    return `translate3d(${translateX}, ${translateY}, 0)`;
  }

  private _widthValue(): string {
    const gapsWidth = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsWidthInsideItem = this._grid.colsGaps
      .slice(this.item.col, this.item.col + this.item.cols - 1)
      .reduce((acc, gap) => acc + gap, 0);

    return `calc((100cqw - ${gapsWidth}px) / ${this._grid.cols} * ${this.item.cols} + ${gapsWidthInsideItem}px)`;
  }

  private _heightValue(): string {
    const gapsHeight = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsHeightInsideItem = this._grid.rowsGaps
      .slice(this.item.row, this.item.row + this.item.rows - 1)
      .reduce((acc, gap) => acc + gap, 0);

    return `calc((100cqh - ${gapsHeight}px) / ${this._grid.rows} * ${this.item.rows} + ${gapsHeightInsideItem}px)`;
  }
}