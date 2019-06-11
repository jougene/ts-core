import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'; // development only
import * as fetch from 'node-fetch';

export class EosApi {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static ADDRESS_LENGTH = 12;

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private api: Api;
    private signature: JsSignatureProvider;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(settings: IEosApiSettings) {
        this.signature = new JsSignatureProvider(settings.privateKeys || []);

        this.api = new Api({
            rpc: new JsonRpc(settings.endpoint, { fetch }),
            chainId: settings.chainId,
            signatureProvider: this.signature,
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder()
        });
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getAccountInfo(name: string): Promise<any> {
        return this.api.rpc.get_account(name);
    }
}

export interface IEosApiSettings {
    endpoint: string;
    chainId?: string;
    privateKeys?: Array<string>;
}