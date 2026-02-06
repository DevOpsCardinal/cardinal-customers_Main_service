export namespace Entidades {
  export class SedeDTO {
    public IdSede: number;
    public FkEmpresa: number;
    public Nombre: string;
    public Departamento: string;
    public Municipio: string;
    public Direccion: string;
    public Encargado: string;

    constructor(
      idSede: number,
      fkEmpresa: number,
      nombre: string,
      departamento: string,
      municipio: string,
      direccion: string,
      encargado: string
    ) {
      this.IdSede = idSede;
      this.FkEmpresa = fkEmpresa;
      this.Nombre = nombre;
      this.Departamento = departamento;
      this.Municipio = municipio;
      this.Direccion = direccion;
      this.Encargado = encargado;
    }

    public static fromDatabase(row: any): SedeDTO {
      const idSede = row.IdSede !== undefined ? row.IdSede : (row.idSede !== undefined ? row.idSede : 0);
      const parsedIdSede = typeof idSede === 'string' ? parseInt(idSede, 10) : idSede;
      
      return new SedeDTO(
        parsedIdSede || 0,
        row.FkEmpresa || row.fkEmpresa,
        row.Nombre || row.nombre,
        row.Departamento || row.departamento,
        row.Municipio || row.municipio,
        row.Direccion || row.direccion,
        row.Encargado || row.encargado
      );
    }
  }
}
