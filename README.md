# Desarrollo de Aplicaciones Móviles - Entorno Docker

Este repositorio contiene el entorno de desarrollo que se utilizará durante la materia **Desarrollo de Aplicaciones Móviles**.

El proyecto utiliza Docker Compose para proporcionar el mismo entorno de trabajo a todos los estudiantes y evitar problemas relacionados con diferentes versiones o configuraciones de Node.js, Ionic, Python, MariaDB y otras herramientas.

## Arquitectura

El entorno está compuesto por los siguientes servicios:

| Servicio            | Tecnología       | Dirección                   |
| ------------------- | ---------------- | --------------------------- |
| Aplicación móvil    | Ionic + Angular  | http://localhost:8100       |
| API REST            | FastAPI + Python | http://localhost:8000       |
| Documentación API   | Swagger          | http://localhost:8000/docs  |
| Documentación API   | ReDoc            | http://localhost:8000/redoc |
| Base de datos       | MariaDB          | Uso interno en Docker       |
| Administrador de BD | CloudBeaver      | http://localhost:8978       |

La arquitectura general es:

```text
Ionic
  |
  | HTTP / JSON
  v
FastAPI
  |
  | SQL
  v
MariaDB
```

CloudBeaver permite administrar gráficamente la base de datos MariaDB.

## Requisitos

Antes de comenzar es necesario instalar:

* Docker Desktop
* Visual Studio Code
* Git

No es necesario instalar:

* Node.js
* npm
* Ionic CLI
* Angular CLI
* Python
* pip
* FastAPI
* MariaDB
* MySQL
* XAMPP
* CloudBeaver

Todas estas herramientas y sus dependencias se ejecutan mediante Docker.

## 1. Verificar Docker

Docker Desktop debe estar iniciado antes de trabajar con el proyecto.

Abrir PowerShell y ejecutar:

```powershell
docker --version
```

Después:

```powershell
docker compose version
```

Ambos comandos deben mostrar la versión instalada.

## 2. Descargar el proyecto

Abrir PowerShell y ubicarse en la carpeta donde se desea guardar el proyecto.

Ejecutar:

```powershell
git clone https://github.com/JonathanDeLaCruz/docker_moviles.git
```

Entrar al proyecto:

```powershell
cd docker_moviles
```

La terminal debe estar ubicada en la carpeta donde se encuentra:

```text
docker-compose.yml
```

## 3. Estructura del proyecto

La estructura principal es:

```text
docker_moviles/
│
├── docker-compose.yml
├── README.md
│
├── database/
│   └── init/
│       └── 01_database.sql
│
├── api/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       └── database.py
│
└── mobile/
    ├── Dockerfile
    ├── package.json
    ├── package-lock.json
    ├── angular.json
    ├── ionic.config.json
    ├── capacitor.config.ts
    └── src/
```

### `database`

Contiene los archivos utilizados para crear e inicializar la base de datos.

El archivo principal es:

```text
database/init/01_database.sql
```

### `api`

Contiene la API REST desarrollada utilizando FastAPI.

El código fuente se encuentra principalmente en:

```text
api/app/
```

### `mobile`

Contiene la aplicación móvil desarrollada con Ionic y Angular.

El código fuente se encuentra principalmente en:

```text
mobile/src/
```

## 4. Primera ejecución

Para iniciar todo el entorno por primera vez ejecutar:

```powershell
docker compose up --build
```

La primera ejecución puede tardar varios minutos.

Docker descargará y configurará automáticamente las imágenes, dependencias, redes y volúmenes necesarios.

No es necesario ejecutar `npm install`, `pip install`, instalar MariaDB ni configurar XAMPP.

Cuando termine el proceso estarán disponibles los diferentes servicios.

## 5. Acceder a los servicios

### Ionic

Abrir:

```text
http://localhost:8100
```

Aquí se ejecuta la aplicación Ionic.

### FastAPI

Abrir:

```text
http://localhost:8000
```

Permite comprobar que la API se encuentra funcionando.

### Swagger

Abrir:

```text
http://localhost:8000/docs
```

Swagger permite consultar y probar los endpoints disponibles en la API.

Durante el curso se utilizará para probar operaciones como:

```text
GET
POST
PUT
PATCH
DELETE
```

antes de consumirlas desde Ionic.

### ReDoc

La documentación alternativa de la API está disponible en:

```text
http://localhost:8000/redoc
```

### CloudBeaver

Abrir:

```text
http://localhost:8978
```

CloudBeaver permite administrar gráficamente MariaDB.

## 6. Conectar CloudBeaver con MariaDB

Crear una conexión de tipo **MariaDB** utilizando:

```text
Host: db
Puerto: 3306
Base de datos: moviles
Usuario: moviles
Contraseña: moviles123
```

Es importante utilizar:

```text
db
```

como host y no:

```text
localhost
```

Los servicios se encuentran dentro de la misma red Docker y pueden comunicarse utilizando el nombre definido para cada servicio.

## 7. Iniciar el proyecto

Después de la primera construcción normalmente será suficiente ejecutar:

```powershell
docker compose up
```

Para ejecutarlo en segundo plano:

```powershell
docker compose up -d
```

## 8. Detener el proyecto

Ejecutar:

```powershell
docker compose down
```

Este comando elimina los contenedores del proyecto, pero conserva los datos almacenados en los volúmenes.

Por lo tanto, la información de MariaDB no se pierde.

## 9. Consultar los servicios

Para conocer el estado de los contenedores:

```powershell
docker compose ps
```

Todos los servicios necesarios deben aparecer activos.

## 10. Consultar los logs

Para consultar todos los logs:

```powershell
docker compose logs
```

Para observarlos en tiempo real:

```powershell
docker compose logs -f
```

También se puede consultar únicamente un servicio.

API:

```powershell
docker compose logs -f api
```

Ionic:

```powershell
docker compose logs -f mobile
```

MariaDB:

```powershell
docker compose logs -f db
```

CloudBeaver:

```powershell
docker compose logs -f cloudbeaver
```

## 11. Trabajar con el código

Los archivos deben modificarse normalmente desde Visual Studio Code.

No se debe modificar el código entrando directamente a los contenedores.

Para trabajar con FastAPI:

```text
api/app/
```

Para trabajar con Ionic:

```text
mobile/src/
```

Docker tiene conectadas estas carpetas con los contenedores correspondientes, por lo que los cambios realizados en Visual Studio Code estarán disponibles dentro del entorno Docker.

## 12. Ejecutar comandos de Ionic

Ionic no está instalado directamente en Windows.

Los comandos deben ejecutarse dentro del contenedor `mobile`.

Para comprobar la versión:

```powershell
docker compose exec mobile ionic --version
```

Para crear una página:

```powershell
docker compose exec mobile ionic generate page productos
```

Para crear un servicio:

```powershell
docker compose exec mobile ionic generate service services/productos
```

## 13. Ejecutar comandos npm

npm tampoco necesita estar instalado directamente en Windows.

Para comprobar su versión:

```powershell
docker compose exec mobile npm --version
```

Si durante el desarrollo es necesario instalar una dependencia:

```powershell
docker compose exec mobile npm install NOMBRE_PAQUETE
```

Cuando se agreguen dependencias se deben conservar los cambios realizados en:

```text
package.json
package-lock.json
```

Esto permite que todos los integrantes del grupo trabajen utilizando las mismas versiones.

## 14. Persistencia de la base de datos

MariaDB utiliza un volumen Docker para almacenar su información.

Ejecutar:

```powershell
docker compose down
```

no elimina la base de datos.

Al ejecutar nuevamente:

```powershell
docker compose up
```

los datos anteriores continuarán disponibles.

## 15. Reiniciar completamente la base de datos

Si se necesita eliminar la base de datos y comenzar nuevamente:

```powershell
docker compose down -v
```

Después:

```powershell
docker compose up --build
```

El parámetro `-v` elimina los volúmenes del proyecto.

Por lo tanto:

```powershell
docker compose down -v
```

elimina los datos almacenados en MariaDB.

No ejecutar este comando si existe información que deba conservarse.

## 16. Reconstruir el proyecto

Si se modifica un Dockerfile, `requirements.txt` o alguna configuración utilizada durante la construcción:

```powershell
docker compose up --build
```

Si se necesita realizar una construcción completamente nueva:

```powershell
docker compose build --no-cache
docker compose up
```

Normalmente no es necesario reconstruir las imágenes al modificar únicamente código fuente.

## 17. Flujo de trabajo del curso

El desarrollo seguirá progresivamente la arquitectura:

```text
Base de datos
      |
      v
   FastAPI
      |
      v
    Ionic
```

Primero se diseñará y construirá la base de datos.

Después se desarrollará la API REST utilizando FastAPI.

Los endpoints se probarán utilizando Swagger:

```text
http://localhost:8000/docs
```

Finalmente, la aplicación Ionic consumirá los servicios proporcionados por la API.

El flujo completo será:

```text
Ionic
   |
   | HTTP / JSON
   v
FastAPI
   |
   | SQL
   v
MariaDB
```

## 18. Comandos principales

Iniciar:

```powershell
docker compose up
```

Iniciar y construir:

```powershell
docker compose up --build
```

Iniciar en segundo plano:

```powershell
docker compose up -d
```

Ver estado:

```powershell
docker compose ps
```

Ver logs:

```powershell
docker compose logs -f
```

Detener:

```powershell
docker compose down
```

Detener y eliminar los datos:

```powershell
docker compose down -v
```

## 19. Solución de problemas

Si el proyecto no funciona correctamente, primero ejecutar:

```powershell
docker compose ps
```

Después revisar:

```powershell
docker compose logs
```

No instalar Node.js, Python, MariaDB, Ionic, Angular u otras herramientas directamente en Windows para intentar solucionar un problema del proyecto.

El objetivo de este entorno es mantener las mismas herramientas y versiones para todos los estudiantes mediante Docker.

## 20. Consideraciones importantes

Durante el curso se utilizarán las versiones definidas en este proyecto.

No se deben actualizar individualmente las versiones de Ionic, Angular, Node.js, Python, FastAPI o MariaDB salvo indicación expresa.

Esto permite mantener un entorno uniforme y reproducible para todos los integrantes del grupo.

---

## Desarrollo de Aplicaciones Móviles

Material preparado para la asignatura de Desarrollo de Aplicaciones Móviles.

El objetivo del repositorio es proporcionar un entorno reproducible para desarrollar durante el curso una aplicación completa utilizando:

```text
MariaDB -> FastAPI -> Ionic
```
