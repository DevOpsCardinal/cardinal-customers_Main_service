import { Entidades } from "../../../Entidades/DTO/UsuarioDTO";

export namespace Infrastructura {
  export interface IUsuariosRepositorio {
    obtenerTodos(): Promise<Entidades.UsuarioDTO[]>;
    obtenerPorId(idUsuario: number): Promise<Entidades.UsuarioDTO | null>;
    crear(usuario: Entidades.UsuarioDTO): Promise<Entidades.UsuarioDTO>;
    actualizar(usuario: Entidades.UsuarioDTO): Promise<boolean>;
    eliminar(idUsuario: number): Promise<boolean>;
  }
}
