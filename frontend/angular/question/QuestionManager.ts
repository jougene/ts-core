import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { PromiseHandler } from '../../../common/promise';
import { Destroyable } from '../../Destroyable';
import { INotificationContent } from '../notification';
import { IWindowContent } from '../window';
import { IQuestion, QuestionEvent, QuestionMode, QuestionOptions } from './IQuestion';

export class QuestionManager extends Destroyable implements IQuestion<string> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public text: string;
    public mode: QuestionMode;
    public options: QuestionOptions;

    public notText: string;
    public yesText: string;
    public closeText: string;
    public checkText: string;

    protected _isChecked: boolean = false;

    protected _closePromise: PromiseHandler<void>;
    protected _yesNotPromise: PromiseHandler<void>;

    //--------------------------------------------------------------------------
    //
    //  Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected content: IWindowContent | INotificationContent) {
        super();
        this.mode = QuestionMode.QUESTION;
        this._closePromise = PromiseHandler.create<void>();
        this._yesNotPromise = PromiseHandler.create<void>();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public initialize(options: QuestionOptions): void {
        this.options = _.assign(
            {
                mode: QuestionMode.INFO,
                isChecked: false,
                yesTextId: 'general.yes',
                notTextId: 'general.no',
                closeTextId: 'general.close'
            },
            options
        );
        this.text = this.options.text;
        this.mode = this.options.mode;
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    public closeClickHandler(): void {
        this._closePromise.resolve();
        this.content.emit(QuestionEvent.CLOSE);
        this.content.close();
    }

    public yesClickHandler(): void {
        this._yesNotPromise.resolve();
        this.content.emit(QuestionEvent.YES);
        this.closeClickHandler();
    }

    public notClickHandler(): void {
        this._yesNotPromise.reject();
        this.content.emit(QuestionEvent.NOT);
        this.closeClickHandler();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this._yesNotPromise) {
            this._yesNotPromise.reject();
            this._yesNotPromise = null;
        }
        if (this._closePromise) {
            this._closePromise.resolve();
            this._closePromise = null;
        }
        this.content = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Interface Properties
    //
    //--------------------------------------------------------------------------

    public get events(): Observable<QuestionEvent | string> {
        return this.content.events;
    }

    public get yesNotPromise(): Promise<void> {
        return this._yesNotPromise.promise;
    }

    public get closePromise(): Promise<void> {
        return this._closePromise.promise;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get isChecked(): boolean {
        return this._isChecked;
    }
    public set isChecked(value: boolean) {
        if (value === this._isChecked) {
            return;
        }
        this._isChecked = value;
        this.content.emit(value ? QuestionEvent.CHECK : QuestionEvent.UNCHECK);
    }
}