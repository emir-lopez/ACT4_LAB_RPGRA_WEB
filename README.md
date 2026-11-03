# Explorador de Ejercicios (Wger API)

Aplicacion web en HTML5, CSS3 y JavaScript ES6+ vanilla, sin frameworks ni dependencias.

## Como ejecutarla

Opcion A - Visual Studio (boton verde):
1. Descomprimir el .zip.
2. Abrir WgerGymExplorer.sln.
3. Pulsar el boton verde de inicio. Se abre http://localhost:5180

Si Visual Studio indica que falta el runtime de .NET 8, cambiar `TargetFramework`
en WgerGymExplorer.csproj por la version instalada (por ejemplo net9.0 o net10.0).
El puerto se cambia en Properties/launchSettings.json (`applicationUrl`).

Opcion B - sin servidor:
Abrir index.html directamente en el navegador.

## Estructura

- index.html: maquetacion semantica.
- css/variables.css: unica fuente de verdad del diseno (paleta, tipografia, espaciado).
- css/styles.css: estilos estructurales.
- js/api.js: construccion de URLs y fetch.
- js/app.js: DOM, eventos y estados (carga, vacio, error).
- WgerGymExplorer.csproj, Program.cs, Properties/: anfitrion estatico solo para Visual Studio.
