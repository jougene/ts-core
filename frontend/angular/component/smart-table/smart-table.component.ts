import { EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { Row } from 'ng2-smart-table/lib/lib/data-set/row';
import { DestroyableContainer, LoadableEvent } from '../../../../common';
import { ObjectUtil } from '../../../../common/util';
import { LanguageService } from '../../language';
import { TableMapCollection, TablePagedMapCollection } from '../../smart-table';

export abstract class SmartTableComponent<V, U extends TableMapCollection<V, any> | TablePagedMapCollection<V, any>> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public isHideHeader: boolean = false;
    @Input()
    public isHideSubHeader: boolean = false;
    @Input()
    public isHideActions: boolean = true;
    @Input()
    public isHidePager: boolean = false;
    @Input()
    public hiddenColumns: Array<string>;

    @Output()
    public createClick: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public editClick: EventEmitter<V> = new EventEmitter<V>();

    @Output()
    public deleteClick: EventEmitter<V> = new EventEmitter<V>();

    @Output()
    public rowClick: EventEmitter<V> = new EventEmitter<V>();

    private _settings: any;
    private _table: U;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    protected constructor(language: LanguageService) {
        super();
        this.addSubscription(
            language.events.subscribe(data => {
                if (data.type === LoadableEvent.COMPLETE) {
                    this.commitTableProperties();
                }
            })
        );
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitTableProperties(): void {
        this._settings = this.getTableSettings(this.table);
    }

    protected checkSettings(settings: any): void {
        if (!settings.hasOwnProperty('hideHeader')) {
            settings.hideHeader = this.isHideHeader;
        }
        if (!settings.hasOwnProperty('hideSubHeader')) {
            settings.hideSubHeader = this.isHideSubHeader;
        }
        if (!settings.hasOwnProperty('actions')) {
            settings.actions = !this.isHideActions;
        }
        if (!settings.hasOwnProperty('rowClassFunction')) {
            settings.rowClassFunction = this.rowClassFunction;
        }
        if (!settings.hasOwnProperty('pager')) {
            settings.pager = this.isHidePager ? { display: false } : { display: true, perPage: this.getPageSize() };
        }

        if (_.isEmpty(settings.columns)) {
            return;
        }

        if (this.hiddenColumns) {
            for (let column of this.hiddenColumns) {
                delete settings.columns[column];
            }
        }

        if (ObjectUtil.instanceOf(this.table, ['sort'])) {
            let sort = (this.table as any).sort;
            for (let pair of Object.entries(sort)) {
                let column = settings.columns[pair[0]];
                if (column) {
                    column.sortDirection = pair[1] ? 'asc' : 'desc';
                }
            }
        }
    }

    protected abstract getTableSettings(table: U): any;

    protected getColumnTranslateId(key: string): string {
        return key;
    }

    protected getPageSize(): number {
        return ObjectUtil.instanceOf(this.table, ['pageSize']) ? (this.table as any).pageSize : 10;
    }

    protected rowClassFunction(value: Row): string {
        return 'mouse-inactive text-one-line';
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get settings(): any {
        return this._settings;
    }

    public get table(): U {
        return this._table;
    }
    @Input()
    public set table(value: U) {
        if (value === this._table) {
            return;
        }

        this._table = value;
        if (this._table) {
            this.commitTableProperties();
        }
    }
}
