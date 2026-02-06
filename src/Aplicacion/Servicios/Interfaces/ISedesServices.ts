import { Entidades } from "../../../Entidades/DTO/SedeDTO";

export namespace Aplicacion {
  export interface ISedesServices {
    obtenerTodasLasSedes(): Promise<Entidades.SedeDTO[]>;
    obtenerSedePorId(idSede: number): Promise<Entidades.SedeDTO | null>;
    crearSede(sede: Entidades.SedeDTO): Promise<Entidades.SedeDTO>;
    actualizarSede(sede: Entidades.SedeDTO): Promise<boolean>;
    eliminarSede(idSede: number): Promise<boolean>;
  }
}
