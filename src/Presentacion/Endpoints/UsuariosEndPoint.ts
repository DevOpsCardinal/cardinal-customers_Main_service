import { Request, Response, Router } from "express";
import { Aplicacion } from "../../Aplicacion/Servicios/Interfaces/IUsuariosServices";
import { Entidades } from "../../Entidades/DTO/UsuarioDTO";

export namespace Presentacion {
  export class UsuariosEndPoint {
    private router: Router;
    private usuariosServices: Aplicacion.IUsuariosServices;

    constructor(usuariosServices: Aplicacion.IUsuariosServices) {
      this.router = Router();
      this.usuariosServices = usuariosServices;
      this.configurarRutas();
    }

    private configurarRutas(): void {
      /**
       * @swagger
       * /api/usuarios/:
       *   get:
       *     summary: Obtener todos los usuarios activos
       *     tags: [Usuarios]
       *     responses:
       *       200:
       *         description: Lista de usuarios obtenida exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 $ref: '#/components/schemas/Usuario'
       *       500:
       *         description: Error del servidor
       */
      this.router.get("/", async (req: Request, res: Response) => {
        try {
          const usuarios = await this.usuariosServices.obtenerTodosLosUsuarios();
          res.status(200).json(usuarios);
        } catch (error: any) {
          res.status(500).json({
            error: "Error al obtener los usuarios",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/usuarios/{id}:
       *   get:
       *     summary: Obtener un usuario por ID
       *     tags: [Usuarios]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID del usuario
       *     responses:
       *       200:
       *         description: Usuario encontrado
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Usuario'
       *       404:
       *         description: Usuario no encontrado
       *       500:
       *         description: Error del servidor
       */
      this.router.get("/:id", async (req: Request, res: Response) => {
        try {
          const idUsuario = parseInt(req.params.id);
          if (isNaN(idUsuario)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const usuario = await this.usuariosServices.obtenerUsuarioPorId(idUsuario);
          if (!usuario) {
            return res.status(404).json({
              error: "Usuario no encontrado",
            });
          }

          res.status(200).json(usuario);
        } catch (error: any) {
          res.status(500).json({
            error: "Error al obtener el usuario",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/usuarios/:
       *   post:
       *     summary: Crear un nuevo usuario
       *     tags: [Usuarios]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/UsuarioInput'
       *     responses:
       *       201:
       *         description: Usuario creado exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Usuario'
       *       400:
       *         description: Datos inválidos
       *       500:
       *         description: Error del servidor
       */
      this.router.post("/", async (req: Request, res: Response) => {
        try {
          const usuarioData = req.body;
          const usuario = new Entidades.UsuarioDTO(
            0,
            usuarioData.Nombre,
            usuarioData.Apellido,
            usuarioData.CorreoElectronico,
            usuarioData.SNActivo !== undefined ? usuarioData.SNActivo : 1,
            "",
            usuarioData.Password,
            usuarioData.FkEmpresa
          );

          const usuarioCreado = await this.usuariosServices.crearUsuario(usuario);
          res.status(201).json(usuarioCreado);
        } catch (error: any) {
          res.status(400).json({
            error: "Error al crear el usuario",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/usuarios/{id}:
       *   put:
       *     summary: Actualizar un usuario existente
       *     tags: [Usuarios]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID del usuario
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/UsuarioInput'
       *     responses:
       *       200:
       *         description: Usuario actualizado exitosamente
       *       400:
       *         description: Datos inválidos
       *       404:
       *         description: Usuario no encontrado
       *       500:
       *         description: Error del servidor
       */
      this.router.put("/:id", async (req: Request, res: Response) => {
        try {
          const idUsuario = parseInt(req.params.id);
          if (isNaN(idUsuario)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const usuarioData = req.body;
          const usuario = new Entidades.UsuarioDTO(
            idUsuario,
            usuarioData.Nombre,
            usuarioData.Apellido,
            usuarioData.CorreoElectronico,
            usuarioData.SNActivo !== undefined ? usuarioData.SNActivo : 1,
            usuarioData.UltimoAcceso || "",
            usuarioData.Password,
            usuarioData.FkEmpresa
          );

          const actualizado = await this.usuariosServices.actualizarUsuario(usuario);
          if (!actualizado) {
            return res.status(404).json({
              error: "Usuario no encontrado",
            });
          }

          res.status(200).json({
            mensaje: "Usuario actualizado exitosamente",
          });
        } catch (error: any) {
          res.status(400).json({
            error: "Error al actualizar el usuario",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/usuarios/{id}:
       *   delete:
       *     summary: Eliminar (desactivar) un usuario
       *     tags: [Usuarios]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID del usuario
       *     responses:
       *       200:
       *         description: Usuario eliminado exitosamente
       *       404:
       *         description: Usuario no encontrado
       *       500:
       *         description: Error del servidor
       */
      this.router.delete("/:id", async (req: Request, res: Response) => {
        try {
          const idUsuario = parseInt(req.params.id);
          if (isNaN(idUsuario)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const eliminado = await this.usuariosServices.eliminarUsuario(idUsuario);
          if (!eliminado) {
            return res.status(404).json({
              error: "Usuario no encontrado",
            });
          }

          res.status(200).json({
            mensaje: "Usuario eliminado exitosamente",
          });
        } catch (error: any) {
          res.status(500).json({
            error: "Error al eliminar el usuario",
            mensaje: error.message,
          });
        }
      });
    }

    public getRouter(): Router {
      return this.router;
    }
  }
}
