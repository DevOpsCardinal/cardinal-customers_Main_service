import { Entidades } from "../../../Entidades/DTO/EmpresaDTO";

export namespace Infrastructura {
  export interface IEmpresasRepositorio {
    obtenerTodas(): Promise<Entidades.EmpresaDTO[]>;
    obtenerPorId(idEmpresa: number): Promise<Entidades.EmpresaDTO | null>;
    crear(empresa: Entidades.EmpresaDTO): Promise<Entidades.EmpresaDTO>;
    actualizar(empresa: Entidades.EmpresaDTO): Promise<boolean>;
    eliminar(idEmpresa: number): Promise<boolean>;
  }
}
