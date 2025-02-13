import { ModuleWithProviders, NgModule } from '@angular/core';
import { Logger } from '../../common/logger';
import { ILogger, LoggerLevel } from '../../common/logger/ILogger';
import { DefaultLogger } from '../logger/DefaultLogger';
import { VIModule } from '../VIModule';
import { AssetModule } from './asset/AssetModule';
import { CookieModule, CookieOptions } from './cookie';
import { ClickToCopyDirective, ClickToSelectDirective, FocusDirective } from './directive';
import { LanguageModule } from './language/LanguageModule';
import { LoginGuard, LoginRedirectResolver, LoginResolver } from './login';
import { NotificationModule } from './notification';
import {
    CamelCasePipe,
    FinancePipe,
    MomentDateAdaptivePipe,
    MomentDateFromNowPipe,
    MomentDatePipe,
    MomentTimePipe,
    NgModelErrorPipe,
    SanitizePipe,
    TruncatePipe,
    StartCasePipe
} from './pipe';
import { ThemeModule } from './theme';
import { WindowModule } from './window';

@NgModule({
    declarations: [
        NgModelErrorPipe,
        FinancePipe,
        MomentDateAdaptivePipe,
        MomentDatePipe,
        MomentTimePipe,
        MomentDateFromNowPipe,
        SanitizePipe,
        TruncatePipe,
        CamelCasePipe,
        StartCasePipe,

        FocusDirective,
        ClickToSelectDirective,
        ClickToCopyDirective
    ],
    providers: [LoginResolver, LoginGuard, LoginRedirectResolver],
    exports: [
        VIModule,
        AssetModule,
        LanguageModule,
        WindowModule,
        NotificationModule,
        ThemeModule,

        NgModelErrorPipe,
        FinancePipe,
        MomentDateAdaptivePipe,
        MomentDatePipe,
        MomentTimePipe,
        MomentDateFromNowPipe,
        SanitizePipe,
        TruncatePipe,
        CamelCasePipe,
        StartCasePipe,

        FocusDirective,
        ClickToSelectDirective,
        ClickToCopyDirective
    ]
})
export class VIAngularModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings?: VIAngularSettings): ModuleWithProviders {
        return {
            ngModule: VIAngularModule,
            providers: [
                ...CookieModule.forRoot(settings).providers,
                { provide: VIAngularSettings, useValue: settings },
                { provide: Logger, deps: [VIAngularSettings], useFactory: loggerFactory }
            ]
        };
    }
}

export class VIAngularSettings implements CookieOptions {
    loggerLevel = LoggerLevel.ALL;
}

export function loggerFactory(settings: VIAngularSettings): ILogger {
    if (!settings) {
        settings = new VIAngularSettings();
    }
    return new DefaultLogger(settings.loggerLevel);
}
