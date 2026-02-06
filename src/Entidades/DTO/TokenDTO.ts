export namespace Entidades {
  export class TokenRequestDTO {
    grant_type: string;
    scope: string;
    application_id: string;
    application_secret: string;
    company_id: string;
    user_id: string;
    user_secret: string;
    refresh_token: string;

    constructor(
      grant_type: string,
      scope: string,
      application_id: string,
      application_secret: string,
      company_id: string,
      user_id: string,
      user_secret: string,
      refresh_token: string
    ) {
      this.grant_type = grant_type;
      this.scope = scope;
      this.application_id = application_id;
      this.application_secret = application_secret;
      this.company_id = company_id;
      this.user_id = user_id;
      this.user_secret = user_secret;
      this.refresh_token = refresh_token;
    }

    static fromRequest(body: any): TokenRequestDTO {
      return new TokenRequestDTO(
        body.grant_type || "",
        body.scope || "",
        body.application_id || "",
        body.application_secret || "",
        body.company_id || "",
        body.user_id || "",
        body.user_secret || "",
        body.refresh_token || ""
      );
    }
  }

  export class TokenResponseDTO {
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

    constructor(
      access_token: string,
      token_type: string,
      issued_at: number,
      expires_in: number,
      status: string,
      scope: string,
      application_id: string,
      company_id: string,
      user_id: string,
      user_avatar: string
    ) {
      this.access_token = access_token;
      this.token_type = token_type;
      this.issued_at = issued_at;
      this.expires_in = expires_in;
      this.status = status;
      this.scope = scope;
      this.application_id = application_id;
      this.company_id = company_id;
      this.user_id = user_id;
      this.user_avatar = user_avatar;
    }
  }
}
