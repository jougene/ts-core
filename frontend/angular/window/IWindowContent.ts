import { AfterViewInit, ElementRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DestroyableContainer } from '../../../common';
import { IWindow, WindowEvent } from './IWindow';
import { WindowConfig } from './WindowConfig';

export abstract class IWindowContent<T = any> extends DestroyableContainer implements AfterViewInit {
    // --------------------------------------------------------------------------
    //
    //  Properties=
    //
    // --------------------------------------------------------------------------

    protected _window: IWindow<T>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(public container: ViewContainerRef) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitWindowProperties(): void {
        this.commitConfigProperties();
    }
    protected commitConfigProperties(): void {}

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public ngAfterViewInit(): void {
        this.emit(WindowEvent.CONTENT_READY);
    }

    public blink(): void {
        if (this.window) {
            this.window.blink();
        }
    }

    public shake(): void {
        if (this.window) {
            this.window.shake();
        }
    }

    public emit(event: string): void {
        if (this.window) {
            this.window.emit(event);
        }
    }

    public close(): void {
        if (this.window) {
            this.window.close();
        }
    }

    public destroy(): void {
        super.destroy();
        this.window = null;
        this.container = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Proxy Public Properties
    //
    // --------------------------------------------------------------------------

    public get data(): T {
        return this.config ? this.config.data : null;
    }

    public get isOnTop(): boolean {
        return this.window ? this.window.isOnTop : false;
    }

    public get isMinimized(): boolean {
        return this.window ? this.window.isMinimized : false;
    }

    public get events(): Observable<string> {
        return this.window ? this.window.events : null;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get element(): ElementRef {
        return this.container ? this.container.element : null;
    }

    public get config(): WindowConfig<T> {
        return this._window ? this._window.config : null;
    }

    public get window(): IWindow {
        return this._window;
    }
    public set window(value: IWindow) {
        if (value === this._window) {
            return;
        }
        this._window = value;
        if (this._window) {
            this.commitWindowProperties();
        }
    }
}
