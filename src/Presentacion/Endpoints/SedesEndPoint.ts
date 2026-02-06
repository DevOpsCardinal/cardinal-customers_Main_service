import { Request, Response, Router } from "express";
import { Aplicacion } from "../../Aplicacion/Servicios/Interfaces/ISedesServices";
import { Entidades } from "../../Entidades/DTO/SedeDTO";

export namespace Presentacion {
  export class SedesEndPoint {
    private router: Router;
    private sedesServices: Aplicacion.ISedesServices;

    constructor(sedesServices: Aplicacion.ISedesServices) {
      this.router = Router();
      this.sedesServices = sedesServices;
      this.configurarRutas();
    }

    private configurarRutas(): void {
      /**
       * @swagger
       * /api/sedes/:
       *   get:
       *     summary: Obtener todas las sedes
       *     tags: [Sedes]
       *     responses:
       *       200:
       *         description: Lista de sedes obtenida exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 $ref: '#/components/schemas/Sede'
       *       500:
       *         description: Error del servidor
       */
      this.router.get("/", async (req: Request, res: Response) => {
        try {
          const sedes = await this.sedesServices.obtenerTodasLasSedes();
          res.status(200).json(sedes);
        } catch (error: any) {
          res.status(500).json({
            error: "Error al obtener las sedes",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/sedes/{id}:
       *   get:
       *     summary: Obtener una sede por ID
       *     tags: [Sedes]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID de la sede
       *     responses:
       *       200:
       *         description: Sede encontrada
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Sede'
       *       404:
       *         description: Sede no encontrada
       *       500:
       *         description: Error del servidor
       */
      this.router.get("/:id", async (req: Request, res: Response) => {
        try {
          const idSede = parseInt(req.params.id);
          if (isNaN(idSede)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const sede = await this.sedesServices.obtenerSedePorId(idSede);
          if (!sede) {
            return res.status(404).json({
              error: "Sede no encontrada",
            });
          }

          res.status(200).json(sede);
        } catch (error: any) {
          res.status(500).json({
            error: "Error al obtener la sede",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/sedes/:
       *   post:
       *     summary: Crear una nueva sede
       *     tags: [Sedes]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/SedeInput'
       *     responses:
       *       201:
       *         description: Sede creada exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Sede'
       *       400:
       *         description: Datos inválidos
       *       500:
       *         description: Error del servidor
       */
      this.router.post("/", async (req: Request, res: Response) => {
        try {
          const sedeData = req.body;
          const sede = new Entidades.SedeDTO(
            0,
            sedeData.FkEmpresa,
            sedeData.Nombre,
            sedeData.Departamento,
            sedeData.Municipio,
            sedeData.Direccion,
            sedeData.Encargado
          );

          const sedeCreada = await this.sedesServices.crearSede(sede);
          res.status(201).json(sedeCreada);
        } catch (error: any) {
          res.status(400).json({
            error: "Error al crear la sede",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/sedes/{id}:
       *   put:
       *     summary: Actualizar una sede existente
       *     tags: [Sedes]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID de la sede
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/SedeInput'
       *     responses:
       *       200:
       *         description: Sede actualizada exitosamente
       *       400:
       *         description: Datos inválidos
       *       404:
       *         description: Sede no encontrada
       *       500:
       *         description: Error del servidor
       */
      this.router.put("/:id", async (req: Request, res: Response) => {
        try {
          const idSede = parseInt(req.params.id);
          if (isNaN(idSede)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const sedeData = req.body;
          const sede = new Entidades.SedeDTO(
            idSede,
            sedeData.FkEmpresa,
            sedeData.Nombre,
            sedeData.Departamento,
            sedeData.Municipio,
            sedeData.Direccion,
            sedeData.Encargado
          );

          const actualizado = await this.sedesServices.actualizarSede(sede);
          if (!actualizado) {
            return res.status(404).json({
              error: "Sede no encontrada",
            });
          }

          res.status(200).json({
            mensaje: "Sede actualizada exitosamente",
          });
        } catch (error: any) {
          res.status(400).json({
            error: "Error al actualizar la sede",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/sedes/{id}:
       *   delete:
       *     summary: Eliminar una sede
       *     tags: [Sedes]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID de la sede
       *     responses:
       *       200:
       *         description: Sede eliminada exitosamente
       *       404:
       *         description: Sede no encontrada
       *       500:
       *         description: Error del servidor
       */
      this.router.delete("/:id", async (req: Request, res: Response) => {
        try {
          const idSede = parseInt(req.params.id);
          if (isNaN(idSede)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const eliminado = await this.sedesServices.eliminarSede(idSede);
          if (!eliminado) {
            return res.status(404).json({
              error: "Sede no encontrada",
            });
          }

          res.status(200).json({
            mensaje: "Sede eliminada exitosamente",
          });
        } catch (error: any) {
          res.status(500).json({
            error: "Error al eliminar la sede",
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
