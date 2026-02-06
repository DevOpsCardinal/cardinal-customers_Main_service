import { Request, Response, Router } from "express";
import { Aplicacion } from "../../Aplicacion/Servicios/Interfaces/IEmpresasServices";
import { Entidades } from "../../Entidades/DTO/EmpresaDTO";

export namespace Presentacion {
  export class EmpresasEndPoint {
    private router: Router;
    private empresasServices: Aplicacion.IEmpresasServices;

    constructor(empresasServices: Aplicacion.IEmpresasServices) {
      this.router = Router();
      this.empresasServices = empresasServices;
      this.configurarRutas();
    }

    private configurarRutas(): void {
      /**
       * @swagger
       * /api/empresas/:
       *   get:
       *     summary: Obtener todas las empresas activas
       *     tags: [Empresas]
       *     responses:
       *       200:
       *         description: Lista de empresas obtenida exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 $ref: '#/components/schemas/Empresa'
       *       500:
       *         description: Error del servidor
       */
      this.router.get("/", async (req: Request, res: Response) => {
        try {
          const empresas = await this.empresasServices.obtenerTodasLasEmpresas();
          res.status(200).json(empresas);
        } catch (error: any) {
          res.status(500).json({
            error: "Error al obtener las empresas",
            mensaje: error.message,
          });
        }
      });

       /**
       * @swagger
       * /api/empresas/dropdown:
       *   get:
       *     summary: Obtener todas las empresas activas para dropdown (endpoint público)
       *     tags: [Empresas]
       *     security: []
       *     responses:
       *       200:
       *         description: Lista de empresas obtenida exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 $ref: '#/components/schemas/Empresa'
       *       500:
       *         description: Error del servidor
       */
       this.router.get("/dropdown", async (req: Request, res: Response) => {
        try {
          const empresas = await this.empresasServices.obtenerTodasLasEmpresas();
          res.status(200).json(empresas);
        } catch (error: any) {
          res.status(500).json({
            error: "Error al obtener las empresas",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/empresas/{id}:
       *   get:
       *     summary: Obtener una empresa por ID
       *     tags: [Empresas]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID de la empresa
       *     responses:
       *       200:
       *         description: Empresa encontrada
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Empresa'
       *       404:
       *         description: Empresa no encontrada
       *       500:
       *         description: Error del servidor
       */
      this.router.get("/:id", async (req: Request, res: Response) => {
        try {
          const idEmpresa = parseInt(req.params.id);
          if (isNaN(idEmpresa)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const empresa = await this.empresasServices.obtenerEmpresaPorId(idEmpresa);
          if (!empresa) {
            return res.status(404).json({
              error: "Empresa no encontrada",
            });
          }

          res.status(200).json(empresa);
        } catch (error: any) {
          res.status(500).json({
            error: "Error al obtener la empresa",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/empresas/:
       *   post:
       *     summary: Crear una nueva empresa
       *     tags: [Empresas]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/EmpresaInput'
       *     responses:
       *       201:
       *         description: Empresa creada exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Empresa'
       *       400:
       *         description: Datos inválidos
       *       500:
       *         description: Error del servidor
       */
      this.router.post("/", async (req: Request, res: Response) => {
        try {
          const empresaData = req.body;
          const empresa = new Entidades.EmpresaDTO(
            0,
            empresaData.Nombre,
            empresaData.Descripcion || "",
            "",
            empresaData.CorreoElectronico,
            empresaData.SNActiva !== undefined ? empresaData.SNActiva : 1,
            empresaData.Logo || ""
          );

          const empresaCreada = await this.empresasServices.crearEmpresa(empresa);
          res.status(201).json(empresaCreada);
        } catch (error: any) {
          res.status(400).json({
            error: "Error al crear la empresa",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/empresas/{id}:
       *   put:
       *     summary: Actualizar una empresa existente
       *     tags: [Empresas]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID de la empresa
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/EmpresaInput'
       *     responses:
       *       200:
       *         description: Empresa actualizada exitosamente
       *       400:
       *         description: Datos inválidos
       *       404:
       *         description: Empresa no encontrada
       *       500:
       *         description: Error del servidor
       */
      this.router.put("/:id", async (req: Request, res: Response) => {
        try {
          const idEmpresa = parseInt(req.params.id);
          if (isNaN(idEmpresa)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const empresaData = req.body;
          const empresa = new Entidades.EmpresaDTO(
            idEmpresa,
            empresaData.Nombre,
            empresaData.Descripcion || "",
            empresaData.FechaCreacion || "",
            empresaData.CorreoElectronico,
            empresaData.SNActiva !== undefined ? empresaData.SNActiva : 1,
            empresaData.Logo || ""
          );

          const actualizado = await this.empresasServices.actualizarEmpresa(empresa);
          if (!actualizado) {
            return res.status(404).json({
              error: "Empresa no encontrada",
            });
          }

          res.status(200).json({
            mensaje: "Empresa actualizada exitosamente",
          });
        } catch (error: any) {
          res.status(400).json({
            error: "Error al actualizar la empresa",
            mensaje: error.message,
          });
        }
      });

      /**
       * @swagger
       * /api/empresas/{id}:
       *   delete:
       *     summary: Eliminar (desactivar) una empresa
       *     tags: [Empresas]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *         description: ID de la empresa
       *     responses:
       *       200:
       *         description: Empresa eliminada exitosamente
       *       404:
       *         description: Empresa no encontrada
       *       500:
       *         description: Error del servidor
       */
      this.router.delete("/:id", async (req: Request, res: Response) => {
        try {
          const idEmpresa = parseInt(req.params.id);
          if (isNaN(idEmpresa)) {
            return res.status(400).json({
              error: "El ID debe ser un número válido",
            });
          }

          const eliminado = await this.empresasServices.eliminarEmpresa(idEmpresa);
          if (!eliminado) {
            return res.status(404).json({
              error: "Empresa no encontrada",
            });
          }

          res.status(200).json({
            mensaje: "Empresa eliminada exitosamente",
          });
        } catch (error: any) {
          res.status(500).json({
            error: "Error al eliminar la empresa",
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
