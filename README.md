# 🌹 Podcast de Amor — Para Samira

Un podcast romántico hecho con amor, diseñado para ser publicado en **GitHub Pages**.

## 📁 Estructura del proyecto

```
docs/
├── index.html      ← Página principal (vista de tu pareja)
├── admin.html      ← Panel de administración (solo para ti)
├── style.css       ← Estilos glasmorfismo romántico
├── app.js          ← Lógica compartida
└── audio/
    └── README.md   ← Instrucciones de audio
```

## 🚀 Publicar en GitHub Pages

1. **Crea un repositorio** en GitHub (puede ser privado)
2. **Sube todos los archivos** de esta carpeta `docs/`
3. Ve a **Settings → Pages**
4. En *Source* selecciona: **Deploy from a branch**
5. Branch: `main` / Folder: `/docs`
6. ¡Listo! Tu URL será: `https://tu-usuario.github.io/tu-repo/`

## 🎵 Agregar audios

1. Coloca tu archivo `.mp3` en `docs/audio/`
2. Haz commit y push al repositorio
3. Entra al panel Admin en `tu-url/admin.html`
4. Contraseña inicial: **`teamo123`** (¡cámbiala en el panel!)
5. Agrega el episodio con la ruta: `audio/nombre-archivo.mp3`

## 🔒 Contraseña admin

- **Contraseña por defecto:** `teamo123`
- Cámbiala desde el panel Admin → Pestaña Seguridad
- La contraseña se guarda localmente en el navegador

## 💡 Tips

- Los datos de episodios se guardan en `localStorage` del navegador donde administras
- Tu pareja puede escuchar desde cualquier dispositivo
- El sitio funciona 100% offline una vez cargado
