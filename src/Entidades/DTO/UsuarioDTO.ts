export namespace Entidades {
  export class UsuarioDTO {
    public IdUsuario: number;
    public Nombre: string;
    public Apellido: string;
    public CorreoElectronico: string;
    public SNActivo: number;
    public UltimoAcceso: string;
    public Password: string;
    public FkEmpresa: number;

    constructor(
      idUsuario: number,
      nombre: string,
      apellido: string,
      correoElectronico: string,
      snActivo: number,
      ultimoAcceso: string,
      password: string,
      fkEmpresa: number
    ) {
      this.IdUsuario = idUsuario;
      this.Nombre = nombre;
      this.Apellido = apellido;
      this.CorreoElectronico = correoElectronico;
      this.SNActivo = snActivo;
      this.UltimoAcceso = ultimoAcceso;
      this.Password = password;
      this.FkEmpresa = fkEmpresa;
    }

    public static fromDatabase(row: any): UsuarioDTO {
      return new UsuarioDTO(
        row.IdUsuario || row.idUsuario,
        row.Nombre || row.nombre,
        row.Apellido || row.apellido,
        row.CorreoElectronico || row.correoElectronico,
        row.SNActivo !== undefined ? row.SNActivo : row.snActivo,
        row.UltimoAcceso || row.ultimoAcceso || "",
        row.Password || row.password || "",
        row.FkEmpresa || row.fkEmpresa
      );
    }
  }
}
