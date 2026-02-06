import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Presentacion } from "./Presentacion/Endpoints/EmpresasEndPoint";
import { Aplicacion } from "./Aplicacion/Servicios/Implementacion/EmpresasServices";
import { Infrastructura } from "./Infrastructura/Repositorios/Implementacion/EmpresasRepositorio";
import { Presentacion as PresentacionUsuarios } from "./Presentacion/Endpoints/UsuariosEndPoint";
import { Aplicacion as AplicacionUsuarios } from "./Aplicacion/Servicios/Implementacion/UsuariosServices";
import { Infrastructura as InfrastructuraUsuarios } from "./Infrastructura/Repositorios/Implementacion/UsuariosRepositorio";
import { Presentacion as PresentacionOAuth } from "./Presentacion/Endpoints/OAuthEndPoint";
import { Aplicacion as AplicacionOAuth } from "./Aplicacion/Servicios/Implementacion/OAuthServices";
import { Infrastructura as InfrastructuraOAuth } from "./Infrastructura/Repositorios/Implementacion/OAuthRepositorio";
import { Presentacion as PresentacionSedes } from "./Presentacion/Endpoints/SedesEndPoint";
import { Aplicacion as AplicacionSedes } from "./Aplicacion/Servicios/Implementacion/SedesServices";
import { Infrastructura as InfrastructuraSedes } from "./Infrastructura/Repositorios/Implementacion/SedesRepositorio";
import { authMiddleware } from "./Presentacion/Middleware/authMiddleware";

// Cargar variables de entorno
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ["http://localhost:8081", "http://localhost:8081"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cardinal Portal Clientes API",
      version: "1.0.0",
      description: "API para gestión de empresas y usuarios usando Clean Architecture",
      contact: {
        name: "Cardinal",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtenido del endpoint /api/oauth/token",
        },
      },
      schemas: {
        Empresa: {
          type: "object",
          properties: {
            IdEmpresa: {
              type: "integer",
              description: "Identificador único de la empresa",
              example: 1,
            },
            Nombre: {
              type: "string",
              description: "Nombre de la empresa",
              example: "Cargill",
            },
            Descripcion: {
              type: "string",
              description: "Descripción de la empresa",
              example: "Cargill is a family company providing food, ingredients, agricultural solutions and industrial products to nourish the world.",
            },
            FechaCreacion: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación de la empresa",
              example: "2026-01-01 00:00:00",
            },
            CorreoElectronico: {
              type: "string",
              format: "email",
              description: "Correo electrónico de la empresa",
              example: "cardinal@cargill.com",
            },
            SNActiva: {
              type: "integer",
              description: "Indicador de empresa activa (1) o inactiva (0)",
              example: 1,
            },
            Logo: {
              type: "string",
              description: "URL o ruta del logo de la empresa",
              example: "",
            },
          },
          required: ["IdEmpresa", "Nombre", "CorreoElectronico", "SNActiva"],
        },
        EmpresaInput: {
          type: "object",
          properties: {
            Nombre: {
              type: "string",
              description: "Nombre de la empresa",
              example: "Cargill",
            },
            Descripcion: {
              type: "string",
              description: "Descripción de la empresa",
              example: "Cargill is a family company providing food, ingredients, agricultural solutions and industrial products to nourish the world.",
            },
            CorreoElectronico: {
              type: "string",
              format: "email",
              description: "Correo electrónico de la empresa",
              example: "cardinal@cargill.com",
            },
            SNActiva: {
              type: "integer",
              description: "Indicador de empresa activa (1) o inactiva (0)",
              example: 1,
            },
            Logo: {
              type: "string",
              description: "URL o ruta del logo de la empresa",
              example: "",
            },
          },
          required: ["Nombre", "CorreoElectronico"],
        },
        Usuario: {
          type: "object",
          properties: {
            IdUsuario: {
              type: "integer",
              description: "Identificador único del usuario",
              example: 1,
            },
            Nombre: {
              type: "string",
              description: "Nombre del usuario",
              example: "Pedro",
            },
            Apellido: {
              type: "string",
              description: "Apellido del usuario",
              example: "Perez",
            },
            CorreoElectronico: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
              example: "pedro.perez@cargill.com",
            },
            SNActivo: {
              type: "integer",
              description: "Indicador de usuario activo (1) o inactivo (0)",
              example: 1,
            },
            UltimoAcceso: {
              type: "string",
              format: "date-time",
              description: "Fecha y hora del último acceso del usuario",
              example: "2026-01-01 00:00:00",
            },
            Password: {
              type: "string",
              description: "Contraseña del usuario",
              example: "12345",
            },
            FkEmpresa: {
              type: "integer",
              description: "ID de la empresa a la que pertenece el usuario",
              example: 1,
            },
          },
          required: ["IdUsuario", "Nombre", "Apellido", "CorreoElectronico", "SNActivo", "FkEmpresa"],
        },
        UsuarioInput: {
          type: "object",
          properties: {
            Nombre: {
              type: "string",
              description: "Nombre del usuario",
              example: "Pedro",
            },
            Apellido: {
              type: "string",
              description: "Apellido del usuario",
              example: "Perez",
            },
            CorreoElectronico: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
              example: "pedro.perez@cargill.com",
            },
            SNActivo: {
              type: "integer",
              description: "Indicador de usuario activo (1) o inactivo (0)",
              example: 1,
            },
            Password: {
              type: "string",
              description: "Contraseña del usuario",
              example: "12345",
            },
            FkEmpresa: {
              type: "integer",
              description: "ID de la empresa a la que pertenece el usuario",
              example: 1,
            },
          },
          required: ["Nombre", "Apellido", "CorreoElectronico", "Password", "FkEmpresa"],
        },
        Sede: {
          type: "object",
          properties: {
            IdSede: {
              type: "integer",
              description: "Identificador único de la sede",
              example: 1,
            },
            FkEmpresa: {
              type: "integer",
              description: "ID de la empresa a la que pertenece la sede",
              example: 1,
            },
            Nombre: {
              type: "string",
              description: "Nombre de la sede",
              example: "BlackRiver Branch",
            },
            Departamento: {
              type: "string",
              description: "Departamento donde se encuentra la sede",
              example: "Antioquia",
            },
            Municipio: {
              type: "string",
              description: "Municipio donde se encuentra la sede",
              example: "Rionegro",
            },
            Direccion: {
              type: "string",
              description: "Dirección de la sede",
              example: "Carrea 10 # 42-08",
            },
            Encargado: {
              type: "string",
              description: "Nombre del encargado de la sede",
              example: "Piter Languila",
            },
          },
          required: ["IdSede", "FkEmpresa", "Nombre", "Departamento", "Municipio", "Direccion", "Encargado"],
        },
        SedeInput: {
          type: "object",
          properties: {
            FkEmpresa: {
              type: "integer",
              description: "ID de la empresa a la que pertenece la sede",
              example: 1,
            },
            Nombre: {
              type: "string",
              description: "Nombre de la sede",
              example: "BlackRiver Branch",
            },
            Departamento: {
              type: "string",
              description: "Departamento donde se encuentra la sede",
              example: "Antioquia",
            },
            Municipio: {
              type: "string",
              description: "Municipio donde se encuentra la sede",
              example: "Rionegro",
            },
            Direccion: {
              type: "string",
              description: "Dirección de la sede",
              example: "Carrea 10 # 42-08",
            },
            Encargado: {
              type: "string",
              description: "Nombre del encargado de la sede",
              example: "Piter Languila",
            },
          },
          required: ["FkEmpresa", "Nombre", "Departamento", "Municipio", "Direccion", "Encargado"],
        },
      },
    },
    tags: [
      {
        name: "Empresas",
        description: "Endpoints para gestión de empresas",
      },
      {
        name: "Usuarios",
        description: "Endpoints para gestión de usuarios",
      },
      {
        name: "OAuth",
        description: "Endpoints para autenticación OAuth",
      },
      {
        name: "Sedes",
        description: "Endpoints para gestión de sedes",
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts"], // Ruta a los archivos con anotaciones Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configurar Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Exponer el JSON de OpenAPI para NSwag
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Middleware de autorización - aplica a todas las rutas excepto /api/oauth
app.use((req: Request, res: Response, next: any) => {
  // Excluir rutas de OAuth, documentación y empresas/dropdown
  if (req.path.startsWith("/api/oauth") || req.path.startsWith("/api-docs") || req.path === "/" || req.path === "/api/empresas/dropdown") {
    return next();
  }
  // Aplicar middleware de autorización a todas las demás rutas
  authMiddleware(req, res, next);
});

// Dependency Injection - Configuración de dependencias
const empresasRepositorio = new Infrastructura.EmpresasRepositorio();
const empresasServices = new Aplicacion.EmpresasServices(empresasRepositorio);
const empresasEndPoint = new Presentacion.EmpresasEndPoint(empresasServices);

const usuariosRepositorio = new InfrastructuraUsuarios.UsuariosRepositorio();
const usuariosServices = new AplicacionUsuarios.UsuariosServices(usuariosRepositorio);
const usuariosEndPoint = new PresentacionUsuarios.UsuariosEndPoint(usuariosServices);

const oauthRepositorio = new InfrastructuraOAuth.OAuthRepositorio();
const oauthServices = new AplicacionOAuth.OAuthServices(oauthRepositorio);
const oauthEndPoint = new PresentacionOAuth.OAuthEndPoint(oauthServices);

const sedesRepositorio = new InfrastructuraSedes.SedesRepositorio();
const sedesServices = new AplicacionSedes.SedesServices(sedesRepositorio);
const sedesEndPoint = new PresentacionSedes.SedesEndPoint(sedesServices);

// Rutas
app.use("/api/empresas", empresasEndPoint.getRouter());
app.use("/api/usuarios", usuariosEndPoint.getRouter());
app.use("/api/oauth", oauthEndPoint.getRouter());
app.use("/api/sedes", sedesEndPoint.getRouter());

// Ruta raíz
app.get("/", (req: Request, res: Response) => {
  res.json({
    mensaje: "Cardinal Portal Clientes API",
    version: "1.0.0",
    documentacion: "/api-docs",
  });
});

// Manejo de errores
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error no manejado:", err);
  res.status(500).json({
    error: "Error interno del servidor",
    mensaje: err.message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});

// Manejo de cierre graceful
process.on("SIGTERM", async () => {
  console.log("Cerrando conexiones...");
  await empresasRepositorio.cerrarConexiones();
  await usuariosRepositorio.cerrarConexiones();
  await sedesRepositorio.cerrarConexiones();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Cerrando conexiones...");
  await empresasRepositorio.cerrarConexiones();
  await usuariosRepositorio.cerrarConexiones();
  await sedesRepositorio.cerrarConexiones();
  process.exit(0);
});
