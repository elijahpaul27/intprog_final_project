import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from '../environments/environment';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AccountModule } from './account/account.module';
import { AlertComponent } from './_components/alert.component';
import { AccountService } from './_services';
import { LayoutComponent } from './_components/layout/layout.component';
import { AdminModule } from './admin/admin.module';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,
        AccountModule,
        AdminModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        LayoutComponent,
        HomeComponent
    ],    providers: [
        { 
            provide: APP_INITIALIZER, 
            useFactory: appInitializer, 
            multi: true, 
            deps: [AccountService] 
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        environment.useFakeBackend ? fakeBackendProvider : []
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }