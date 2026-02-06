import { Entidades } from "../../../Entidades/DTO/TokenDTO";

export namespace Infrastructura {
  export interface IOAuthRepositorio {
    generarToken(request: Entidades.TokenRequestDTO): Promise<Entidades.TokenResponseDTO>;
  }
}
