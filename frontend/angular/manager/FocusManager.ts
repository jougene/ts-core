import { ElementRef } from '@angular/core';
import { Destroyable } from '../../../common/Destroyable';
import { ViewUtil } from '../util';

export class FocusManager extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected timer: any;
    protected delay: number;
    protected element: HTMLElement;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, delay: number = 100) {
        super();
        this.delay = delay;
        this.element = ViewUtil.parseElement(element);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private focusElement = () => {
        if (this.element) {
            ViewUtil.focusInput(this.element as any);
        }
    };

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public focus(): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.focusElement, 100);
    }

    public destroy(): void {
        this.element = null;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
