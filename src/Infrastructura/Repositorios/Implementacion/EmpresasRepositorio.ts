import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { Entidades } from "../../../Entidades/DTO/EmpresaDTO";
import type { Infrastructura as InfrastructuraInterface } from "../Interfaces/IEmpresasRepositorio";

export namespace Infrastructura {
  export class EmpresasRepositorio implements InfrastructuraInterface.IEmpresasRepositorio {
    private pool: Pool;

    constructor() {
      this.pool = mysql.createPool({
        host: process.env.MYSQL_HOST || "127.0.0.1",
        port: parseInt(process.env.MYSQL_PORT || "3306"),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "PielLozana1v@",
        database: process.env.MYSQL_DATABASE || "cardinal-cutomer-db",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    async obtenerTodas(): Promise<Entidades.EmpresaDTO[]> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [rows] = await connection.execute(
          "SELECT * FROM empresas WHERE SNActiva = 1"
        );
        const empresas = (rows as any[]).map((row) =>
          Entidades.EmpresaDTO.fromDatabase(row)
        );
        return empresas;
      } catch (error) {
        console.error("Error al obtener empresas:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async obtenerPorId(idEmpresa: number): Promise<Entidades.EmpresaDTO | null> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [rows] = await connection.execute(
          "SELECT * FROM empresas WHERE IdEmpresa = ? AND SNActiva = 1",
          [idEmpresa]
        );
        const result = rows as any[];
        if (result.length === 0) {
          return null;
        }
        return Entidades.EmpresaDTO.fromDatabase(result[0]);
      } catch (error) {
        console.error("Error al obtener empresa por ID:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async crear(empresa: Entidades.EmpresaDTO): Promise<Entidades.EmpresaDTO> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          `INSERT INTO empresas (Nombre, Descripcion, FechaCreacion, CorreoElectronico, SNActiva, Logo) 
           VALUES (?, ?, NOW(), ?, ?, ?)`,
          [
            empresa.Nombre,
            empresa.Descripcion,
            empresa.CorreoElectronico,
            empresa.SNActiva,
            empresa.Logo,
          ]
        );
        const insertResult = result as any;
        empresa.IdEmpresa = insertResult.insertId;
        return empresa;
      } catch (error) {
        console.error("Error al crear empresa:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async actualizar(empresa: Entidades.EmpresaDTO): Promise<boolean> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          `UPDATE empresas 
           SET Nombre = ?, Descripcion = ?, CorreoElectronico = ?, SNActiva = ?, Logo = ? 
           WHERE IdEmpresa = ?`,
          [
            empresa.Nombre,
            empresa.Descripcion,
            empresa.CorreoElectronico,
            empresa.SNActiva,
            empresa.Logo,
            empresa.IdEmpresa,
          ]
        );
        const updateResult = result as any;
        return updateResult.affectedRows > 0;
      } catch (error) {
        console.error("Error al actualizar empresa:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async eliminar(idEmpresa: number): Promise<boolean> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          "UPDATE empresas SET SNActiva = 0 WHERE IdEmpresa = ?",
          [idEmpresa]
        );
        const deleteResult = result as any;
        return deleteResult.affectedRows > 0;
      } catch (error) {
        console.error("Error al eliminar empresa:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async cerrarConexiones(): Promise<void> {
      await this.pool.end();
    }
  }
}
