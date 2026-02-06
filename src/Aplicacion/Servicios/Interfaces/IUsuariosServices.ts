import { Entidades } from "../../../Entidades/DTO/UsuarioDTO";

export namespace Aplicacion {
  export interface IUsuariosServices {
    obtenerTodosLosUsuarios(): Promise<Entidades.UsuarioDTO[]>;
    obtenerUsuarioPorId(idUsuario: number): Promise<Entidades.UsuarioDTO | null>;
    crearUsuario(usuario: Entidades.UsuarioDTO): Promise<Entidades.UsuarioDTO>;
    actualizarUsuario(usuario: Entidades.UsuarioDTO): Promise<boolean>;
    eliminarUsuario(idUsuario: number): Promise<boolean>;
  }
}
