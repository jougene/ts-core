import { Directive, ElementRef, Input } from '@angular/core';
import * as _ from 'lodash';
import { Destroyable } from '../../../common/Destroyable';
import { FocusManager } from '../manager';

@Directive({
    selector: '[vi-focus]'
})
export class FocusDirective<T = any> extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private manager: FocusManager;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super();
        this.manager = new FocusManager(element);
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected focus = (): void => {
        this.manager.focus();
    };

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (!_.isNil(this.manager)) {
            this.manager.destroy();
            this.manager = null;
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('vi-focus')
    public set trigger(value: T) {
        this.focus();
    }
}
