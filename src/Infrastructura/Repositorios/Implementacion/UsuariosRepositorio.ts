import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { Entidades } from "../../../Entidades/DTO/UsuarioDTO";
import type { Infrastructura as InfrastructuraInterface } from "../Interfaces/IUsuariosRepositorio";

export namespace Infrastructura {
  export class UsuariosRepositorio implements InfrastructuraInterface.IUsuariosRepositorio {
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

    async obtenerTodos(): Promise<Entidades.UsuarioDTO[]> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [rows] = await connection.execute(
          "SELECT * FROM usuarios_empresas WHERE SNActivo = 1"
        );
        const usuarios = (rows as any[]).map((row) =>
          Entidades.UsuarioDTO.fromDatabase(row)
        );
        return usuarios;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async obtenerPorId(idUsuario: number): Promise<Entidades.UsuarioDTO | null> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [rows] = await connection.execute(
          "SELECT * FROM usuarios_empresas WHERE IdUsuario = ? AND SNActivo = 1",
          [idUsuario]
        );
        const result = rows as any[];
        if (result.length === 0) {
          return null;
        }
        return Entidades.UsuarioDTO.fromDatabase(result[0]);
      } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async crear(usuario: Entidades.UsuarioDTO): Promise<Entidades.UsuarioDTO> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          `INSERT INTO usuarios_empresas (Nombre, Apellido, CorreoElectronico, SNActivo, UltimoAcceso, Password, FkEmpresa) 
           VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
          [
            usuario.Nombre,
            usuario.Apellido,
            usuario.CorreoElectronico,
            usuario.SNActivo,
            usuario.Password,
            usuario.FkEmpresa,
          ]
        );
        const insertResult = result as any;
        usuario.IdUsuario = insertResult.insertId;
        return usuario;
      } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async actualizar(usuario: Entidades.UsuarioDTO): Promise<boolean> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          `UPDATE usuarios_empresas 
           SET Nombre = ?, Apellido = ?, CorreoElectronico = ?, SNActivo = ?, Password = ?, FkEmpresa = ? 
           WHERE IdUsuario = ?`,
          [
            usuario.Nombre,
            usuario.Apellido,
            usuario.CorreoElectronico,
            usuario.SNActivo,
            usuario.Password,
            usuario.FkEmpresa,
            usuario.IdUsuario,
          ]
        );
        const updateResult = result as any;
        return updateResult.affectedRows > 0;
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    async eliminar(idUsuario: number): Promise<boolean> {
      let connection: PoolConnection | null = null;
      try {
        connection = await this.pool.getConnection();
        const [result] = await connection.execute(
          "UPDATE usuarios_empresas SET SNActivo = 0 WHERE IdUsuario = ?",
          [idUsuario]
        );
        const deleteResult = result as any;
        return deleteResult.affectedRows > 0;
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
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
