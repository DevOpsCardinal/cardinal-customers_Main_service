import { Entidades } from "../../../Entidades/DTO/EmpresaDTO";

export namespace Aplicacion {
  export interface IEmpresasServices {
    obtenerTodasLasEmpresas(): Promise<Entidades.EmpresaDTO[]>;
    obtenerEmpresaPorId(idEmpresa: number): Promise<Entidades.EmpresaDTO | null>;
    crearEmpresa(empresa: Entidades.EmpresaDTO): Promise<Entidades.EmpresaDTO>;
    actualizarEmpresa(empresa: Entidades.EmpresaDTO): Promise<boolean>;
    eliminarEmpresa(idEmpresa: number): Promise<boolean>;
  }
}
