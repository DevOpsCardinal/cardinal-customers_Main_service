import { Entidades } from "../../../Entidades/DTO/EmpresaDTO";
import type { Aplicacion as AplicacionInterface } from "../Interfaces/IEmpresasServices";
import { Infrastructura } from "../../../Infrastructura/Repositorios/Interfaces/IEmpresasRepositorio";

export namespace Aplicacion {
  export class EmpresasServices implements AplicacionInterface.IEmpresasServices {
    private repositorio: Infrastructura.IEmpresasRepositorio;

    constructor(repositorio: Infrastructura.IEmpresasRepositorio) {
      this.repositorio = repositorio;
    }

    async obtenerTodasLasEmpresas(): Promise<Entidades.EmpresaDTO[]> {
      try {
        return await this.repositorio.obtenerTodas();
      } catch (error) {
        console.error("Error en servicio al obtener todas las empresas:", error);
        throw error;
      }
    }

    async obtenerEmpresaPorId(idEmpresa: number): Promise<Entidades.EmpresaDTO | null> {
      try {
        if (!idEmpresa || idEmpresa <= 0) {
          throw new Error("El ID de empresa debe ser un número válido mayor que 0");
        }
        return await this.repositorio.obtenerPorId(idEmpresa);
      } catch (error) {
        console.error("Error en servicio al obtener empresa por ID:", error);
        throw error;
      }
    }

    async crearEmpresa(empresa: Entidades.EmpresaDTO): Promise<Entidades.EmpresaDTO> {
      try {
        this.validarEmpresa(empresa);
        return await this.repositorio.crear(empresa);
      } catch (error) {
        console.error("Error en servicio al crear empresa:", error);
        throw error;
      }
    }

    async actualizarEmpresa(empresa: Entidades.EmpresaDTO): Promise<boolean> {
      try {
        if (!empresa.IdEmpresa || empresa.IdEmpresa <= 0) {
          throw new Error("El ID de empresa es requerido para actualizar");
        }
        this.validarEmpresa(empresa);
        return await this.repositorio.actualizar(empresa);
      } catch (error) {
        console.error("Error en servicio al actualizar empresa:", error);
        throw error;
      }
    }

    async eliminarEmpresa(idEmpresa: number): Promise<boolean> {
      try {
        if (!idEmpresa || idEmpresa <= 0) {
          throw new Error("El ID de empresa debe ser un número válido mayor que 0");
        }
        return await this.repositorio.eliminar(idEmpresa);
      } catch (error) {
        console.error("Error en servicio al eliminar empresa:", error);
        throw error;
      }
    }

    private validarEmpresa(empresa: Entidades.EmpresaDTO): void {
      if (!empresa.Nombre || empresa.Nombre.trim() === "") {
        throw new Error("El nombre de la empresa es requerido");
      }
      if (!empresa.CorreoElectronico || empresa.CorreoElectronico.trim() === "") {
        throw new Error("El correo electrónico es requerido");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.CorreoElectronico)) {
        throw new Error("El correo electrónico no tiene un formato válido");
      }
      if (empresa.SNActiva !== 0 && empresa.SNActiva !== 1) {
        throw new Error("SNActiva debe ser 0 o 1");
      }
    }
  }
}
