import { Entidades } from "../../../Entidades/DTO/SedeDTO";
import type { Aplicacion as AplicacionInterface } from "../Interfaces/ISedesServices";
import { Infrastructura } from "../../../Infrastructura/Repositorios/Interfaces/ISedesRepositorio";

export namespace Aplicacion {
  export class SedesServices implements AplicacionInterface.ISedesServices {
    private repositorio: Infrastructura.ISedesRepositorio;

    constructor(repositorio: Infrastructura.ISedesRepositorio) {
      this.repositorio = repositorio;
    }

    async obtenerTodasLasSedes(): Promise<Entidades.SedeDTO[]> {
      try {
        return await this.repositorio.obtenerTodas();
      } catch (error) {
        console.error("Error en servicio al obtener todas las sedes:", error);
        throw error;
      }
    }

    async obtenerSedePorId(idSede: number): Promise<Entidades.SedeDTO | null> {
      try {
        if (!idSede || idSede <= 0) {
          throw new Error("El ID de sede debe ser un número válido mayor que 0");
        }
        return await this.repositorio.obtenerPorId(idSede);
      } catch (error) {
        console.error("Error en servicio al obtener sede por ID:", error);
        throw error;
      }
    }

    async crearSede(sede: Entidades.SedeDTO): Promise<Entidades.SedeDTO> {
      try {
        this.validarSede(sede);
        return await this.repositorio.crear(sede);
      } catch (error) {
        console.error("Error en servicio al crear sede:", error);
        throw error;
      }
    }

    async actualizarSede(sede: Entidades.SedeDTO): Promise<boolean> {
      try {
        if (!sede.IdSede || sede.IdSede <= 0) {
          throw new Error("El ID de sede es requerido para actualizar");
        }
        this.validarSede(sede);
        return await this.repositorio.actualizar(sede);
      } catch (error) {
        console.error("Error en servicio al actualizar sede:", error);
        throw error;
      }
    }

    async eliminarSede(idSede: number): Promise<boolean> {
      try {
        if (!idSede || idSede <= 0) {
          throw new Error("El ID de sede debe ser un número válido mayor que 0");
        }
        return await this.repositorio.eliminar(idSede);
      } catch (error) {
        console.error("Error en servicio al eliminar sede:", error);
        throw error;
      }
    }

    private validarSede(sede: Entidades.SedeDTO): void {
      if (!sede.Nombre || sede.Nombre.trim() === "") {
        throw new Error("El nombre de la sede es requerido");
      }
      if (!sede.FkEmpresa || sede.FkEmpresa <= 0) {
        throw new Error("La empresa (FkEmpresa) es requerida y debe ser un número válido mayor que 0");
      }
      if (!sede.Departamento || sede.Departamento.trim() === "") {
        throw new Error("El departamento es requerido");
      }
      if (!sede.Municipio || sede.Municipio.trim() === "") {
        throw new Error("El municipio es requerido");
      }
      if (!sede.Direccion || sede.Direccion.trim() === "") {
        throw new Error("La dirección es requerida");
      }
      if (!sede.Encargado || sede.Encargado.trim() === "") {
        throw new Error("El encargado es requerido");
      }
    }
  }
}
