import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

export interface AppInfo {
    name: string;
    title: string;
    version: string;
    description: string;
}

export interface ApiInfo {
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppInfoService {
    private readonly appInfo: AppInfo;
    private readonly apiInfo: ApiInfo;

    constructor() {
        this.appInfo = {
            name: environment.APP.NAME,
            title: environment.APP.TITLE,
            version: environment.APP.VERSION || '0.0.0',
            description: environment.APP.DESCRIPTION
        };

        this.apiInfo = {
            url: environment.API.URL
        };
    }

    /**
     * Obtiene la información completa de la aplicación
     */
    getAppInfo(): AppInfo {
        return { ...this.appInfo };
    }

    /**
     * Obtiene solo la versión de la aplicación
     */
    getVersion(): string {
        return this.appInfo.version;
    }

    /**
     * Obtiene solo el nombre de la aplicación
     */
    getName(): string {
        return this.appInfo.name;
    }

    /**
     * Obtiene el título de la aplicación
     */
    getTitle(): string {
        return this.appInfo.title;
    }

    /**
     * Obtiene la descripción de la aplicación
     */
    getDescription(): string | undefined {
        return this.appInfo.description;
    }

    /**
     * Obtiene la información completa de la API
     */
    getApiInfo(): ApiInfo {
        return { ...this.apiInfo };
    }

    /**
     * Obtiene solo la URL de la API
     */
    getApiUrl(): string {
        return this.apiInfo.url;
    }
}
