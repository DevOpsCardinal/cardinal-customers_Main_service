import { Request, Response, NextFunction } from "express";

/**
 * Middleware de autorización que valida tokens JWT
 * Verifica la presencia del token Bearer y valida su estructura y expiración
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "No autorizado",
        mensaje: "Token de autorización requerido",
      });
      return;
    }

    // Verificar que el header tenga el formato "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        error: "No autorizado",
        mensaje: "Formato de token inválido. Use: Bearer <token>",
      });
      return;
    }

    const token = parts[1];

    // Validar estructura JWT (debe tener 3 partes separadas por puntos)
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      res.status(401).json({
        error: "No autorizado",
        mensaje: "Token JWT inválido",
      });
      return;
    }

    // Decodificar el payload
    let payload: any;
    try {
      const payloadBase64 = tokenParts[1];
      // Agregar padding si es necesario para base64url
      const padded = payloadBase64 + "=".repeat((4 - (payloadBase64.length % 4)) % 4);
      const payloadBuffer = Buffer.from(padded, "base64url");
      payload = JSON.parse(payloadBuffer.toString("utf-8"));
    } catch (error) {
      res.status(401).json({
        error: "No autorizado",
        mensaje: "Error al decodificar el token",
      });
      return;
    }

    // Validar expiración del token
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        res.status(401).json({
          error: "No autorizado",
          mensaje: "Token expirado",
        });
        return;
      }
    }

    // Validar nbf (not before) si existe
    if (payload.nbf) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.nbf > currentTime) {
        res.status(401).json({
          error: "No autorizado",
          mensaje: "Token aún no válido",
        });
        return;
      }
    }

    // Adjuntar el payload decodificado al request para uso en los endpoints
    (req as any).user = payload;
    (req as any).token = token;

    next();
  } catch (error: any) {
    res.status(401).json({
      error: "No autorizado",
      mensaje: error.message || "Error al validar el token",
    });
  }
};
