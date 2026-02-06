import { Entidades } from "../../../Entidades/DTO/TokenDTO";
import type { Aplicacion as AplicacionInterface } from "../Interfaces/IOAuthServices";
import { Infrastructura } from "../../../Infrastructura/Repositorios/Implementacion/OAuthRepositorio";

export namespace Aplicacion {
  export class OAuthServices implements AplicacionInterface.IOAuthServices {
    private repositorio: Infrastructura.OAuthRepositorio;

    constructor(repositorio: Infrastructura.OAuthRepositorio) {
      this.repositorio = repositorio;
    }

    async generarToken(request: Entidades.TokenRequestDTO): Promise<Entidades.TokenResponseDTO> {
      try {
        this.validarTokenRequest(request);
        return await this.repositorio.generarToken(request);
      } catch (error) {
        console.error("Error en servicio al generar token:", error);
        throw error;
      }
    }

    private validarTokenRequest(request: Entidades.TokenRequestDTO): void {
      if (!request.grant_type || request.grant_type.trim() === "") {
        throw new Error("El grant_type es requerido");
      }
      if (!request.application_id || request.application_id.trim() === "") {
        throw new Error("El application_id es requerido");
      }
      if (!request.application_secret || request.application_secret.trim() === "") {
        throw new Error("El application_secret es requerido");
      }
      if (!request.company_id || request.company_id.trim() === "") {
        throw new Error("El company_id es requerido");
      }
      if (!request.user_id || request.user_id.trim() === "") {
        throw new Error("El user_id es requerido");
      }
      if (!request.user_secret || request.user_secret.trim() === "") {
        throw new Error("El user_secret es requerido");
      }
    }
  }
}
