import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { AbstractSettingsStorage } from '../../common/settings';

export class EnvSettingsStorage extends AbstractSettingsStorage {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(fileName: string = '.env') {
        super();

        try {
            this.data = dotenv.parse(fs.readFileSync(fileName));
        } catch (error) {
            this.data = {};
        } finally {
            this.envInitializedHandler();
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Private Properties
    //
    // --------------------------------------------------------------------------

    protected getPrefferedValue<T>(name: string): T {
        return process.env[name] as any;
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    protected envInitializedHandler(): void {
        this.initializedHandler();
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get isTesting(): boolean {
        return this.getValue('NODE_ENV') === 'testing';
    }

    public get isProduction(): boolean {
        return this.getValue('NODE_ENV') === 'production';
    }

    public get isDevelopment(): boolean {
        return this.getValue('NODE_ENV') === 'development';
    }
}
