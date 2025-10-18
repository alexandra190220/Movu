# Despliegue: Vercel (frontend) + Render (backend)

Resumen rápido:
- Frontend: Vercel (proyecto React + Vite).
- Backend: Render en https://movu-back.onrender.com

Pasos para que todo funcione:

1. Variables de entorno en Vercel
   - En Vercel → Project Settings → Environment Variables:
     - Key: `VITE_API_URL`
     - Value: `https://movu-back.onrender.com/api/v1`
   - Guardar para Production (y Preview si quieres).

2. Configuración de build en Vercel
   - Build command: `npm run build`
   - Output directory: `dist`
   - Framework: Vite (opcional, detectado automáticamente)

3. CORS en el backend (Render)
   - Asegura que la API permita peticiones desde el dominio del frontend o `*` si procede.
   - Si usas cookies/credenciales: habilita `Access-Control-Allow-Credentials: true` y ajusta `credentials` en fetch.

4. Rewrites y rutas SPA
   - Ya se incluyó `vercel.json` en el proyecto con una regla de rewrite para que react-router funcione.

5. Pruebas locales
   - Copia `.env.example` a `.env` si quieres probar localmente.
   - Ejecuta:

```powershell
npm install
npm run dev
```

6. Desplegar
   - Push a la rama que está conectada a Vercel (usualmente `master`/`main`) y Vercel desplegará automáticamente.

7. Verificar
   - Accede al frontend en Vercel y prueba login/registro para validar la integración con el backend en Render.

Notas:
- No guardes `.env` con secrets en repos públicos. Aquí sólo guardamos la URL pública de API.
- Si el backend cambia de ruta base, actualiza `VITE_API_URL` en Vercel.
