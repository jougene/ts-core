import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { MapCollection } from '../../../common/map';
import { Destroyable } from '../../Destroyable';
import { CookieService } from '../cookie';
import { ViewUtil } from '../util';
import { Theme } from './Theme';

@Injectable()
export class ThemeService extends Destroyable {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    private _theme: Theme;
    private _themes: MapCollection<Theme>;

    private observer: Subject<string>;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected cookies: CookieService) {
        super();
        this.observer = new Subject();
        this._themes = new MapCollection('name');
    }

    //--------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    //--------------------------------------------------------------------------

    private removeTheme(value: Theme): void {
        this.cookies.remove('vi-theme');
        if (!value) {
            return;
        }
        let element = document.body;
        ViewUtil.removeClass(element, value.styleName);
    }

    private addTheme(value: Theme): void {
        if (!value) {
            return;
        }
        this.cookies.put('vi-theme', value.name);
        let element = document.body;
        ViewUtil.addClass(element, value.styleName);
    }

    //--------------------------------------------------------------------------
    //
    //	Public Methods
    //
    //--------------------------------------------------------------------------

    public initialize(themes: Array<any>, defaultTheme?: string): void {
        this.themes.clear();

        if (!_.isEmpty(themes)) {
            for (let item of themes) {
                let theme = new Theme();
                theme.update(item);
                this.themes.add(theme);
            }
        }

        let name = this.cookies.get('vi-theme');
        if (_.isNil(name)) {
            name = defaultTheme;
        }

        if (this.themes.has(name)) {
            this.theme = this.themes.get(name);
        } else if (this.themes.length > 0) {
            this.theme = this.themes.collection[0];
        }
    }

    public destroy(): void {
        this._theme = null;
        this.observer = null;
        if (this._themes) {
            this._themes.destroy();
            this._themes = null;
        }
    }

    public getStyle<T>(name: string): T {
        return this.theme ? this.theme.getStyle(name) : null;
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    public get events(): Observable<string> {
        return this.observer.asObservable();
    }

    public get themes(): MapCollection<Theme> {
        return this._themes;
    }

    public get theme(): Theme {
        return this._theme;
    }
    public set theme(value: Theme) {
        if (value === this._theme) {
            return;
        }
        if (this._theme) {
            this.removeTheme(this._theme);
        }

        this._theme = value;
        if (this._theme) {
            this.addTheme(value);
        }
        this.observer.next(ThemeServiceEvent.CHANGED);
    }
}

export enum ThemeServiceEvent {
    CHANGED = 'CHANGED'
}
