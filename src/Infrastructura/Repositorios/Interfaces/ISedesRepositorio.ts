import { Entidades } from "../../../Entidades/DTO/SedeDTO";

export namespace Infrastructura {
  export interface ISedesRepositorio {
    obtenerTodas(): Promise<Entidades.SedeDTO[]>;
    obtenerPorId(idSede: number): Promise<Entidades.SedeDTO | null>;
    crear(sede: Entidades.SedeDTO): Promise<Entidades.SedeDTO>;
    actualizar(sede: Entidades.SedeDTO): Promise<boolean>;
    eliminar(idSede: number): Promise<boolean>;
  }
}
