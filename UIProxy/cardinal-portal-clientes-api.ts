/* tslint:disable */
/* eslint-disable */

export interface Empresa {
    IdEmpresa: number;
    Nombre: string;
    Descripcion: string;
    FechaCreacion: string;
    CorreoElectronico: string;
    SNActiva: number;
    Logo: string;
}

export interface EmpresaInput {
    Nombre: string;
    Descripcion?: string;
    CorreoElectronico: string;
    SNActiva?: number;
    Logo?: string;
}

export interface Usuario {
    IdUsuario: number;
    Nombre: string;
    Apellido: string;
    CorreoElectronico: string;
    SNActivo: number;
    UltimoAcceso: string;
    Password: string;
    FkEmpresa: number;
}

export interface UsuarioInput {
    Nombre: string;
    Apellido: string;
    CorreoElectronico: string;
    SNActivo?: number;
    Password: string;
    FkEmpresa: number;
}

export interface TokenRequest {
    grant_type: string;
    scope?: string;
    application_id: string;
    application_secret: string;
    company_id: string;
    user_id: string;
    user_secret: string;
    refresh_token?: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    issued_at: number;
    expires_in: number;
    status: string;
    scope: string;
    application_id: string;
    company_id: string;
    user_id: string;
    user_avatar: string;
}

export interface Sede {
    IdSede: number;
    FkEmpresa: number;
    Nombre: string;
    Departamento: string;
    Municipio: string;
    Direccion: string;
    Encargado: string;
}

export interface SedeInput {
    FkEmpresa: number;
    Nombre: string;
    Departamento: string;
    Municipio: string;
    Direccion: string;
    Encargado: string;
}

export interface FileParameter {
    data: any;
    fileName: string;
}

export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: { [name: string]: any };
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any }, result: any) {
        super();
        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

export class CardinalPortalClientesApiClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    private accessToken: string | null = null;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        this.http = http ? http : window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "http://localhost:3000";
    }

    setAccessToken(token: string | null): void {
        this.accessToken = token;
    }

    protected transformOptions(options: RequestInit): Promise<RequestInit> {
        if (this.accessToken) {
            if (!options.headers) {
                options.headers = {};
            }
            (options.headers as any)["Authorization"] = "Bearer " + this.accessToken;
        }
        return Promise.resolve(options);
    }

    protected transformResult(url: string, response: Response, processor: (response: Response) => Promise<any>): Promise<any> {
        return processor(response);
    }

    private async processResponse<T>(response: Response, resultProcessor?: ((value: any) => T) | null): Promise<T | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => _headers[k] = v);
        }

        if (status === 200 || status === 201) {
            const _responseText = await response.text();
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return resultProcessor ? resultProcessor(result200) : result200;
        } else if (status === 400) {
            const _responseText = await response.text();
            let result400: any = null;
            let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result400 = resultData400 !== undefined ? resultData400 : <any>null;
            return throwException("Bad Request", status, _responseText, _headers, result400);
        } else if (status === 404) {
            const _responseText = await response.text();
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = resultData404 !== undefined ? resultData404 : <any>null;
            return throwException("Not Found", status, _responseText, _headers, result404);
        } else if (status === 500) {
            const _responseText = await response.text();
            let result500: any = null;
            let resultData500 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result500 = resultData500 !== undefined ? resultData500 : <any>null;
            return throwException("Internal Server Error", status, _responseText, _headers, result500);
        } else if (status !== 200 && status !== 204) {
            const _responseText = await response.text();
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }
        return Promise.resolve<T | null>(<any>null);
    }

    empresas_GetAll(): Promise<Empresa[]> {
        let url_ = this.baseUrl + "/api/empresas/";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Empresa[]>(response));
        });
    }

    empresas_GetDropdown(): Promise<Empresa[]> {
        let url_ = this.baseUrl + "/api/empresas/dropdown";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Empresa[]>(response));
        });
    }

    empresas_Get(id: number): Promise<Empresa> {
        let url_ = this.baseUrl + "/api/empresas/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Empresa>(response));
        });
    }

    empresas_Create(empresa: EmpresaInput): Promise<Empresa> {
        let url_ = this.baseUrl + "/api/empresas/";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(empresa);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Empresa>(response));
        });
    }

    empresas_Update(id: number, empresa: EmpresaInput): Promise<void> {
        let url_ = this.baseUrl + "/api/empresas/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(empresa);

        let options_: RequestInit = {
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<void>(response));
        });
    }

    empresas_Delete(id: number): Promise<void> {
        let url_ = this.baseUrl + "/api/empresas/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "DELETE",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<void>(response));
        });
    }

    usuarios_GetAll(): Promise<Usuario[]> {
        let url_ = this.baseUrl + "/api/usuarios/";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Usuario[]>(response));
        });
    }

    usuarios_Get(id: number): Promise<Usuario> {
        let url_ = this.baseUrl + "/api/usuarios/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Usuario>(response));
        });
    }

    usuarios_Create(usuario: UsuarioInput): Promise<Usuario> {
        let url_ = this.baseUrl + "/api/usuarios/";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(usuario);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Usuario>(response));
        });
    }

    usuarios_Update(id: number, usuario: UsuarioInput): Promise<void> {
        let url_ = this.baseUrl + "/api/usuarios/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(usuario);

        let options_: RequestInit = {
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<void>(response));
        });
    }

    usuarios_Delete(id: number): Promise<void> {
        let url_ = this.baseUrl + "/api/usuarios/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "DELETE",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<void>(response));
        });
    }

    oAuth_Token(request: TokenRequest): Promise<TokenResponse> {
        let url_ = this.baseUrl + "/api/oauth/token";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(request);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<TokenResponse>(response));
        });
    }

    sedes_GetAll(): Promise<Sede[]> {
        let url_ = this.baseUrl + "/api/sedes/";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Sede[]>(response));
        });
    }

    sedes_Get(id: number): Promise<Sede> {
        let url_ = this.baseUrl + "/api/sedes/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Sede>(response));
        });
    }

    sedes_Create(sede: SedeInput): Promise<Sede> {
        let url_ = this.baseUrl + "/api/sedes/";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(sede);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<Sede>(response));
        });
    }

    sedes_Update(id: number, sede: SedeInput): Promise<void> {
        let url_ = this.baseUrl + "/api/sedes/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(sede);

        let options_: RequestInit = {
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<void>(response));
        });
    }

    sedes_Delete(id: number): Promise<void> {
        let url_ = this.baseUrl + "/api/sedes/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "DELETE",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (response) => this.processResponse<void>(response));
        });
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any }, result?: any): any {
    if (result !== null && result !== undefined)
        throw new ApiException(message, status, response, headers, result);
    else
        throw new ApiException(message, status, response, headers, null);
}
