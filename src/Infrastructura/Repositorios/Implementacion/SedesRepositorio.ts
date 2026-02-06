import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { Entidades } from "../../../Entidades/DTO/SedeDTO";
import type { Infrastructura as InfrastructuraInterface } from "../Interfaces/ISedesRepositorio";

export namespace Infrastructura {
  export class SedesRepositorio implements InfrastructuraInterface.ISedesRepositorio {
    private pool: Pool;

    constructor() {
      this.pool = mysql.createPool({
        host: process.env.MYSQL_HOST || "127.0.0.1",
        port: parseInt(process.env.MYSQL_PORT || "3306"),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "cardinal-cutomer-db",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    async obtenerTodas(): Promise<Entidades.SedeDTO[]> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [rows] = await connection.execute(
          "SELECT * FROM sedes"
        );
        const sedes = (rows as any[]).map((row) =>
          Entidades.SedeDTO.fromDatabase(row)
        );
        return sedes;
      } catch (error) {
        console.error("Error al obtener sedes:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async obtenerPorId(idSede: number): Promise<Entidades.SedeDTO | null> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [rows] = await connection.execute(
          "SELECT * FROM sedes WHERE IdSede = ?",
          [idSede]
        );
        const result = rows as any[];
        if (result.length === 0) {
          return null;
        }
        return Entidades.SedeDTO.fromDatabase(result[0]);
      } catch (error) {
        console.error("Error al obtener sede por ID:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async crear(sede: Entidades.SedeDTO): Promise<Entidades.SedeDTO> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          `INSERT INTO sedes (FkEmpresa, Nombre, Departamento, Municipio, Direccion, Encargado) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            sede.FkEmpresa,
            sede.Nombre,
            sede.Departamento,
            sede.Municipio,
            sede.Direccion,
            sede.Encargado,
          ]
        );
        const insertResult = result as any;
        sede.IdSede = insertResult.insertId;
        return sede;
      } catch (error) {
        console.error("Error al crear sede:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async actualizar(sede: Entidades.SedeDTO): Promise<boolean> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          `UPDATE sedes
           SET FkEmpresa = ?, Nombre = ?, Departamento = ?, Municipio = ?, Direccion = ?, Encargado = ? 
           WHERE IdSede = ?`,
          [
            sede.FkEmpresa,
            sede.Nombre,
            sede.Departamento,
            sede.Municipio,
            sede.Direccion,
            sede.Encargado,
            sede.IdSede,
          ]
        );
        const updateResult = result as any;
        return updateResult.affectedRows > 0;
      } catch (error) {
        console.error("Error al actualizar sede:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async eliminar(idSede: number): Promise<boolean> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          "DELETE FROM sedes WHERE IdSede = ?",
          [idSede]
        );
        const deleteResult = result as any;
        return deleteResult.affectedRows > 0;
      } catch (error) {
        console.error("Error al eliminar sede:", error);
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
