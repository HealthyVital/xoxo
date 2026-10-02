# Configurar Gmail y Google Calendar (integraciones reales)

Esta guía explica, paso a paso, cómo activar el envío real de emails por Gmail y la sincronización
real de Google Calendar dentro del CRM. No hace falta saber programar para seguirla, pero sí hace
falta tener acceso a: una cuenta de Google Cloud (gratis), una cuenta de Cloudflare (gratis), y el
repositorio de GitHub (`HealthyVital/xoxo`) con permisos de administrador.

**Por qué hace falta esto:** el sitio es 100% estático (GitHub Pages), sin servidor propio. Para
que Gmail/Calendar funcionen de verdad hace falta un "cliente confidencial" (un secreto que nunca
debe llegar al navegador) y un lugar donde guardar los tokens de cada persona. Por eso se agregó un
pequeño backend gratuito en Cloudflare Workers, solo para esto — el resto del CRM sigue funcionando
igual que antes, sin servidor.

**Nadie necesita hacer esto para que el CRM siga funcionando.** Mientras no se complete esta guía,
la pestaña de Configuración sigue mostrando "Not Connected" como siempre y el botón "Log as sent"
en Outreach sigue funcionando igual que hoy.

---

## Paso 1 — Google Cloud: crear el proyecto y las credenciales OAuth

1. Entrar a [Google Cloud Console](https://console.cloud.google.com/) con cualquier cuenta de
   Google (puede ser personal) y crear un proyecto nuevo (gratis), por ejemplo
   `xoxo-crm-integrations`.
2. En el menú lateral, ir a **"APIs & Services" → "Library"** y habilitar estas dos APIs
   (buscarlas por nombre y hacer clic en "Enable"):
   - **Gmail API**
   - **Google Calendar API**
3. Ir a **"APIs & Services" → "OAuth consent screen"**:
   - Tipo de usuario: **"External"** (Externo).
   - Nombre de la app: algo como "Rotterdam Content CRM".
   - Email de soporte y de contacto: cualquier email del equipo.
   - **Modo de publicación: dejarlo en "Testing"** (Pruebas). Esto es importante — en modo
     "Testing" Google NO exige el proceso de verificación/revisión (que puede tardar semanas),
     siempre y cuando los usuarios estén en la lista de "Test users" del paso siguiente.
   - En **"Test users"**, agregar las 5 direcciones del equipo (las mismas de
     `src/lib/auth.ts` → `ALLOWED_TEAM_EMAILS`):
     - dima.gorba4ev123@gmail.com
     - agrita.gorbacova@gmail.com
     - yogi_khasha@proton.me
     - schneiderswk7@gmail.com
     - vineta.onckule@gmail.com
   - En "Scopes", no hace falta agregar nada manualmente aquí (el Worker los pide directamente al
     momento de conectar).
4. Ir a **"APIs & Services" → "Credentials"** → **"Create Credentials" → "OAuth client ID"**:
   - Tipo de aplicación: **"Web application"**.
   - Nombre: por ejemplo "xoxo-integrations worker".
   - **"Authorized redirect URIs"**: por ahora, poner un valor provisorio como
     `https://example.workers.dev/oauth/callback` — **vas a volver a este paso después del Paso 2**
     para poner la URL real una vez que exista.
   - Guardar. Google te va a mostrar un **Client ID** y un **Client Secret** — copiarlos a un
     lugar seguro (los vas a necesitar en el Paso 2). **Nunca los subas a GitHub ni los pongas en
     el código.**

---

## Paso 2 — Cloudflare: desplegar el backend (Worker)

1. Crear una cuenta gratuita en [Cloudflare](https://dash.cloudflare.com/sign-up) si no existe
   una todavía (el plan gratuito de Workers alcanza de sobra para 5 personas con uso bajo/medio).
2. En tu computadora, con el proyecto descargado, abrir una terminal dentro de la carpeta
   `worker/` del repositorio (`cd worker`).
3. Instalar `wrangler` (la herramienta de línea de comandos de Cloudflare) si no está instalada
   globalmente — no hace falta instalarla a mano, `npx` la descarga sola la primera vez que se usa
   (ver siguientes pasos). Si preferís instalarla de forma permanente:
   ```
   npm install -g wrangler
   ```
4. Iniciar sesión con tu cuenta de Cloudflare:
   ```
   npx wrangler login
   ```
   (Esto abre el navegador para autorizar — seguir las instrucciones en pantalla.)
5. Crear el KV namespace donde se van a guardar los tokens de refresco (nunca las contraseñas ni
   los tokens de acceso, solo un token de refresco por persona y servicio):
   ```
   npx wrangler kv namespace create TOKENS
   ```
   El comando va a imprimir algo como:
   ```
   [[kv_namespaces]]
   binding = "TOKENS"
   id = "a1b2c3d4..."
   ```
   Copiar ese `id` y pegarlo en `worker/wrangler.toml`, reemplazando
   `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.
6. Configurar los 3 secretos (nunca se escriben en ningún archivo del repositorio — Cloudflare los
   guarda cifrados). Cada comando va a pedir que pegues el valor y presiones Enter:
   ```
   npx wrangler secret put GOOGLE_CLIENT_ID
   npx wrangler secret put GOOGLE_CLIENT_SECRET
   npx wrangler secret put STATE_SIGNING_SECRET
   ```
   - `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: los valores que copiaste en el Paso 1.4.
     (Nota: técnicamente el Client ID no es secreto — podrías ponerlo como variable normal en
     `wrangler.toml` en vez de como secret si preferís — pero el Client **Secret** SIEMPRE debe
     ir como `wrangler secret put`, nunca escrito en un archivo. Para simplificar, esta guía pone
     los dos como secrets.)
   - `STATE_SIGNING_SECRET`: cualquier cadena larga y aleatoria que inventes vos — por ejemplo,
     podés generarla así: `node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"` y pegar
     el resultado. No hace falta recordarla, solo que sea difícil de adivinar.
7. (Opcional pero recomendado para producción) Editar `worker/wrangler.toml` y cambiar
   `APP_ORIGIN` de `http://localhost:5173` a `https://healthyvital.github.io/xoxo` antes de
   desplegar, para que el sitio en vivo (no solo tu máquina local) reciba la redirección después
   de conectar una cuenta.
8. Desplegar el Worker:
   ```
   npx wrangler deploy
   ```
   Al terminar, Cloudflare va a imprimir una URL como:
   ```
   https://xoxo-integrations.<tu-subdominio>.workers.dev
   ```
   **Copiar esa URL** — se usa en los Pasos 3 y 4.

---

## Paso 3 — Volver a Google Cloud: poner la URL real

1. Volver a **Google Cloud Console → APIs & Services → Credentials** y editar el "OAuth client ID"
   que creaste en el Paso 1.4.
2. Reemplazar el "Authorized redirect URI" provisorio por la URL real, agregando `/oauth/callback`
   al final:
   ```
   https://xoxo-integrations.<tu-subdominio>.workers.dev/oauth/callback
   ```
3. Guardar.

---

## Paso 4 — GitHub: conectar el sitio con el backend

1. Entrar al repositorio en GitHub (`HealthyVital/xoxo`) → **Settings → Secrets and variables →
   Actions → New repository secret**.
2. Nombre del secreto: `VITE_INTEGRATIONS_API_URL`.
3. Valor: la URL del Worker del Paso 2.8 (sin `/oauth/callback` al final, solo la base), por
   ejemplo:
   ```
   https://xoxo-integrations.<tu-subdominio>.workers.dev
   ```
4. Guardar.
5. Para que el sitio ya desplegado se reconstruya con las integraciones activas, hacer un nuevo
   commit/push a `main` (cualquier cambio sirve), o ir a la pestaña **"Actions"** del repositorio,
   abrir el workflow **"Deploy to GitHub Pages"** y usar **"Run workflow"** para volver a
   ejecutarlo manualmente sin necesidad de un commit nuevo.

---

## Paso 5 — Cómo se conecta cada persona del equipo

Una vez completados los pasos anteriores (y con el sitio reconstruido), cada una de las 5 personas
autorizadas puede conectar su propia cuenta así:

1. Entrar al CRM con su email de equipo (como siempre).
2. Ir a **Configuración (Settings)**.
3. En la fila "Gmail" o "Google Calendar", hacer clic en **"Connect Gmail"** / **"Connect Google
   Calendar"**.
4. Se abre la pantalla de Google para iniciar sesión y dar permiso — **cada persona debe iniciar
   sesión con SU PROPIA cuenta de Gmail**, no con una cuenta compartida. Como el proyecto está en
   modo "Testing" (Paso 1.3), solo las 5 direcciones agregadas como "Test users" van a poder
   completar este paso — si alguien ve un error de Google diciendo que la app no está verificada
   o que no tiene acceso, revisar que su email esté en la lista de "Test users".
5. Después de aceptar, Google redirige de vuelta a Configuración, que muestra "Connected" en esa
   fila.
6. A partir de ahí, en la pestaña **Outreach**, al elegir una plantilla de Email aparece un botón
   **"Send via Gmail"** que envía el correo de verdad (y lo registra en el historial del CRM como
   siempre). Si Gmail no está conectado, o el prospecto no tiene email cargado, el botón normal
   **"Log as sent"** sigue funcionando exactamente igual que antes.
7. Para desconectar una cuenta en cualquier momento, usar el botón **"Disconnect"** en Configuración.

---

## Costos

- **Google Cloud (modo Testing):** $0. El modo "Testing" del consentimiento OAuth es gratis y no
  requiere el proceso de verificación de Google (que sí puede tener costos/demoras si se publica
  en modo "In production" con muchos usuarios — no es necesario para este caso de 5 usuarios
  internos).
- **Cloudflare Workers (plan gratuito):** $0. El plan gratuito incluye 100,000 solicitudes por día,
  muy por encima de lo que 5 personas enviando emails/eventos manualmente van a generar.
- **Gmail API / Google Calendar API:** $0. Ambas son gratuitas dentro de los límites de uso normal
  (cientos de miles de solicitudes/día en las cuotas gratuitas), muy por encima del volumen de un
  equipo de 5 personas.

En resumen: con 5 usuarios y uso bajo/medio, esta integración no genera ningún costo.
