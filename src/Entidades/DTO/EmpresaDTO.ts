export namespace Entidades {
  export class EmpresaDTO {
    public IdEmpresa: number;
    public Nombre: string;
    public Descripcion: string;
    public FechaCreacion: string;
    public CorreoElectronico: string;
    public SNActiva: number;
    public Logo: string;

    constructor(
      idEmpresa: number,
      nombre: string,
      descripcion: string,
      fechaCreacion: string,
      correoElectronico: string,
      snActiva: number,
      logo: string
    ) {
      this.IdEmpresa = idEmpresa;
      this.Nombre = nombre;
      this.Descripcion = descripcion;
      this.FechaCreacion = fechaCreacion;
      this.CorreoElectronico = correoElectronico;
      this.SNActiva = snActiva;
      this.Logo = logo;
    }

    public static fromDatabase(row: any): EmpresaDTO {
      return new EmpresaDTO(
        row.IdEmpresa || row.idEmpresa,
        row.Nombre || row.nombre,
        row.Descripcion || row.descripcion,
        row.FechaCreacion || row.fechaCreacion,
        row.CorreoElectronico || row.correoElectronico,
        row.SNActiva !== undefined ? row.SNActiva : row.snActiva,
        row.Logo || row.logo || ""
      );
    }
  }
}
