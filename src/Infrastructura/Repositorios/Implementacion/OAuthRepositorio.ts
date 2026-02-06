import { Entidades } from "../../../Entidades/DTO/TokenDTO";
import type { Infrastructura as InfrastructuraInterface } from "../Interfaces/IOAuthRepositorio";
import * as crypto from "crypto";

export namespace Infrastructura {
  export class OAuthRepositorio implements InfrastructuraInterface.IOAuthRepositorio {
    async generarToken(request: Entidades.TokenRequestDTO): Promise<Entidades.TokenResponseDTO> {
      try {
        // Generate a random JWT-like token
        const header = {
          alg: "HS256",
          typ: "JWT"
        };

        const payload = {
          ApplicationOwnerId: "1",
          ApplicationOwnerName: "Company_1_Name",
          ApplicationId: "1",
          ApplicationName: "Application_1_Name",
          CompanyId: request.company_id,
          CompanyName: `Company_${request.company_id}_Name`,
          UserId: "6",
          UserName: request.user_id,
          GivenName: "Pedro Perez",
          Email: `${request.user_id}@cargill.com`,
          RoleId: "9",
          RoleName: "RoleName_00000000_00000001_00000002",
          nbf: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 600,
          iat: Math.floor(Date.now() / 1000),
          iss: "cardinal.identity.issuer.com",
          aud: "//audience.cardinal.identity.com/autenticad-users"
        };

        // Encode header and payload
        const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

        // Generate random signature
        const signature = crypto.randomBytes(32).toString("base64url");

        // Create JWT token
        const access_token = `${encodedHeader}.${encodedPayload}.${signature}`;

        // Generate issued_at timestamp (similar to the example)
        const issued_at = Date.now() * 10000 + 621355968000000000;

        // Create response
        const response = new Entidades.TokenResponseDTO(
          access_token,
          "Bearer",
          issued_at,
          600, // expires_in in seconds
          "Success",
          request.scope || "",
          request.application_id,
          request.company_id,
          request.user_id,
          ""
        );

        return response;
      } catch (error) {
        console.error("Error al generar token:", error);
        throw error;
      }
    }
  }
}
