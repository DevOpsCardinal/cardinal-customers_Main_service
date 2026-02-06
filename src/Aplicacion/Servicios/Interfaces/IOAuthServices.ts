import { Entidades } from "../../../Entidades/DTO/TokenDTO";

export namespace Aplicacion {
  export interface IOAuthServices {
    generarToken(request: Entidades.TokenRequestDTO): Promise<Entidades.TokenResponseDTO>;
  }
}
