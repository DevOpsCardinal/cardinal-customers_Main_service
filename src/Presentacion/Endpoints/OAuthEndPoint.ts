import { Request, Response, Router } from "express";
import { Aplicacion } from "../../Aplicacion/Servicios/Interfaces/IOAuthServices";
import { Entidades } from "../../Entidades/DTO/TokenDTO";

export namespace Presentacion {
  export class OAuthEndPoint {
    private router: Router;
    private oauthServices: Aplicacion.IOAuthServices;

    constructor(oauthServices: Aplicacion.IOAuthServices) {
      this.router = Router();
      this.oauthServices = oauthServices;
      this.configurarRutas();
    }

    private configurarRutas(): void {
      /**
       * @swagger
       * /api/oauth/token:
       *   post:
       *     summary: Generar token de acceso OAuth
       *     tags: [OAuth]
       *     security: []
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               grant_type:
       *                 type: string
       *                 example: "ClientCredentials"
       *               scope:
       *                 type: string
       *                 example: ""
       *               application_id:
       *                 type: string
       *                 example: "879FFB6A-4124-41C3-BD24-76C3B2F96109"
       *               application_secret:
       *                 type: string
       *                 example: "96471380-F3F3-4120-9E25-A4E5C9701C23"
       *               company_id:
       *                 type: string
       *                 example: "c5bcea98-2974-4d43-8110-28d402cf5ce2"
       *               user_id:
       *                 type: string
       *                 example: "pedro.perez"
       *               user_secret:
       *                 type: string
       *                 example: "456"
       *               refresh_token:
       *                 type: string
       *                 example: ""
       *             required:
       *               - grant_type
       *               - application_id
       *               - application_secret
       *               - company_id
       *               - user_id
       *               - user_secret
       *     responses:
       *       200:
       *         description: Token generado exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 access_token:
       *                   type: string
       *                   description: Token JWT de acceso
       *                 token_type:
       *                   type: string
       *                   example: "Bearer"
       *                 issued_at:
       *                   type: number
       *                   description: Timestamp de emisión del token
       *                 expires_in:
       *                   type: number
       *                   description: Tiempo de expiración en segundos
       *                 status:
       *                   type: string
       *                   example: "Success"
       *                 scope:
       *                   type: string
       *                 application_id:
       *                   type: string
       *                 company_id:
       *                   type: string
       *                 user_id:
       *                   type: string
       *                 user_avatar:
       *                   type: string
       *       400:
       *         description: Datos inválidos
       *       500:
       *         description: Error del servidor
       */
      this.router.post("/token", async (req: Request, res: Response) => {
        try {
          const tokenRequest = Entidades.TokenRequestDTO.fromRequest(req.body);
          const tokenResponse = await this.oauthServices.generarToken(tokenRequest);
          res.status(200).json(tokenResponse);
        } catch (error: any) {
          const statusCode = error.message.includes("requerido") ? 400 : 500;
          res.status(statusCode).json({
            error: "Error al generar el token",
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
