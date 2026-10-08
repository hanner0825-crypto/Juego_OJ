# 🏜️ Cazador Nocturno: El Monstruo de 3 Ojos 👁️👁️👁️

> Un videojuego 2D de acción y disparos en el desierto nocturno desarrollado con **HTML5 Canvas, JavaScript y CSS**, respaldado por un backend en **Python Flask** con tabla de clasificación en tiempo real.

![HTML5](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-00f0ff?style=for-the-badge)
![Python](https://img.shields.io/badge/Backend-Python%203%20%7C%20Flask-3776ab?style=for-the-badge&logo=python&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completado%20%26%20Desplegado-00ff88?style=for-the-badge)

---

## 📖 Historia y Objetivo del Juego

Bajo la luz plateada de la luna llena en medio del desierto nocturno, tomas el control de un **Cazador Cibernético** armado con pistolas duales. Enfrentarás hordas de criaturas terrestres y voladoras que acechan entre las dunas.

Alcanza **5,000 puntos** para despertar al colosal y temible **Jefe Supremo: El Monstruo de 3 Ojos**, una criatura de pesadilla con ataques elementales independientes por cada ojo:
- 🔴 **Ojo 1 (Ígneo):** Lluvia de meteoros de magma en abanico.
- 🟣 **Ojo 2 (Cósmico):** Rayo láser colosal continuo.
- 🔵 **Ojo 3 (Vacío):** Orbes de energía guiados a alta velocidad.

---

## 🎮 Controles de Juego

| Acción | Tecla / Control | Alternativa |
| :--- | :--- | :--- |
| **Saltar** | <kbd>▲ Flecha Arriba</kbd> | <kbd>W</kbd> |
| **Avanzar** | <kbd>► Flecha Derecha</kbd> | <kbd>D</kbd> |
| **Retroceder** | <kbd>◄ Flecha Izquierda</kbd> | <kbd>A</kbd> |
| **Agacharse / Bajar** | <kbd>▼ Flecha Abajo</kbd> | <kbd>S</kbd> |
| **Disparar Pistolas** | <kbd>Barra Espaciadora</kbd> | <kbd>Clic Ratón</kbd> / <kbd>Z</kbd> / <kbd>X</kbd> |
| **Pausa** | <kbd>Pausa UI</kbd> | Botón en pantalla |
| **Móviles / Táctiles** | D-Pad virtual | Botón de disparo táctil |

---

## ⚡ Power-Ups y Mejoras

Durante la batalla, los monstruos derrotados pueden soltar mejoras:
- 💚 **Poción Médica:** Restaura **+30 HP**.
- ⚡ **Triple Disparo:** Ráfaga en abanico de 3 proyectiles láser.
- 🔥 **Cañón de Plasma:** Disparos de plasma continuo de alto impacto.

---

## 🏗️ Arquitectura del Proyecto

```
JuegoOJ/
├── venv/                     # Entorno virtual de Python
├── app.py                    # Servidor backend Flask y API REST
├── requirements.txt          # Dependencias (Flask, Flask-Cors)
├── scores.json               # Base de datos de puntuaciones (Leaderboard)
├── Procfile                  # Configuración de despliegue en la nube
├── .gitignore                # Archivos excluidos del control de versiones
│
├── index.html                # Interfaz principal, HUD, Modales y Canvas
├── style.css                 # Diseño visual, temática neón/desierto y responsive
└── game.js                   # Motor de física 2D, IA de enemigos, sintetizador de audio
```

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd TU-REPOSITORIO
```

### 2. Crear y activar el entorno virtual
En Windows:
```powershell
python -m venv venv
.\venv\Scripts\activate
```

En Linux / macOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Iniciar el servidor
```bash
python app.py
```

### 5. Abrir el juego
Visita en tu navegador:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🌐 Endpoints de la API Flask

- `GET /` — Sirve la aplicación web completa.
- `GET /api/health` — Comprobación de estado del servidor.
- `GET /api/scores` — Retorna el top 10 de mejores puntuaciones.
- `POST /api/scores` — Registra una nueva puntuación y récord.

---

## 📤 Pasos para subir este proyecto a GitHub

Ejecuta los siguientes comandos en tu terminal dentro de la carpeta del juego:

```powershell
# 1. Inicializar Git
git init

# 2. Agregar todos los archivos (el .gitignore omitirá el venv)
git add .

# 3. Hacer el primer commit
git commit -m "Primer commit: Cazador Nocturno con Frontend Canvas y Backend Flask"

# 4. Cambiar a la rama principal
git branch -M main

# 5. Conectar con tu repositorio de GitHub (Reemplaza con tu URL)
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# 6. Subir el código a GitHub
git push -u origin main
```

---

## 👨‍💻 Créditos
Desarrollado con pasión para juegos web retro arcade y sistemas modernos en Python. ¡Que disfrutes la cacería en el desierto nocturno! 🏜️🔫
