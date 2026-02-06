import { Entidades } from "../../../Entidades/DTO/UsuarioDTO";
import type { Aplicacion as AplicacionInterface } from "../Interfaces/IUsuariosServices";
import { Infrastructura } from "../../../Infrastructura/Repositorios/Interfaces/IUsuariosRepositorio";

export namespace Aplicacion {
  export class UsuariosServices implements AplicacionInterface.IUsuariosServices {
    private repositorio: Infrastructura.IUsuariosRepositorio;

    constructor(repositorio: Infrastructura.IUsuariosRepositorio) {
      this.repositorio = repositorio;
    }

    async obtenerTodosLosUsuarios(): Promise<Entidades.UsuarioDTO[]> {
      try {
        return await this.repositorio.obtenerTodos();
      } catch (error) {
        console.error("Error en servicio al obtener todos los usuarios:", error);
        throw error;
      }
    }

    async obtenerUsuarioPorId(idUsuario: number): Promise<Entidades.UsuarioDTO | null> {
      try {
        if (!idUsuario || idUsuario <= 0) {
          throw new Error("El ID de usuario debe ser un número válido mayor que 0");
        }
        return await this.repositorio.obtenerPorId(idUsuario);
      } catch (error) {
        console.error("Error en servicio al obtener usuario por ID:", error);
        throw error;
      }
    }

    async crearUsuario(usuario: Entidades.UsuarioDTO): Promise<Entidades.UsuarioDTO> {
      try {
        this.validarUsuario(usuario);
        return await this.repositorio.crear(usuario);
      } catch (error) {
        console.error("Error en servicio al crear usuario:", error);
        throw error;
      }
    }

    async actualizarUsuario(usuario: Entidades.UsuarioDTO): Promise<boolean> {
      try {
        if (!usuario.IdUsuario || usuario.IdUsuario <= 0) {
          throw new Error("El ID de usuario es requerido para actualizar");
        }
        this.validarUsuario(usuario);
        return await this.repositorio.actualizar(usuario);
      } catch (error) {
        console.error("Error en servicio al actualizar usuario:", error);
        throw error;
      }
    }

    async eliminarUsuario(idUsuario: number): Promise<boolean> {
      try {
        if (!idUsuario || idUsuario <= 0) {
          throw new Error("El ID de usuario debe ser un número válido mayor que 0");
        }
        return await this.repositorio.eliminar(idUsuario);
      } catch (error) {
        console.error("Error en servicio al eliminar usuario:", error);
        throw error;
      }
    }

    private validarUsuario(usuario: Entidades.UsuarioDTO): void {
      if (!usuario.Nombre || usuario.Nombre.trim() === "") {
        throw new Error("El nombre del usuario es requerido");
      }
      if (!usuario.Apellido || usuario.Apellido.trim() === "") {
        throw new Error("El apellido del usuario es requerido");
      }
      if (!usuario.CorreoElectronico || usuario.CorreoElectronico.trim() === "") {
        throw new Error("El correo electrónico es requerido");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.CorreoElectronico)) {
        throw new Error("El correo electrónico no tiene un formato válido");
      }
      if (usuario.SNActivo !== 0 && usuario.SNActivo !== 1) {
        throw new Error("SNActivo debe ser 0 o 1");
      }
      if (!usuario.FkEmpresa || usuario.FkEmpresa <= 0) {
        throw new Error("La empresa (FkEmpresa) es requerida y debe ser un número válido mayor que 0");
      }
      if (!usuario.Password || usuario.Password.trim() === "") {
        throw new Error("La contraseña es requerida");
      }
    }
  }
}
