const { app, BrowserWindow, session } = require('electron');
const { ElectronBlocker } = require('@ghostery/adblocker-electron');
const fetch = require('cross-fetch'); // Utilisé pour récupérer les listes de filtres pour le bloqueur de pubs

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,  // Masquer automatiquement la barre de menus
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Masquer la barre de menus même en mode plein écran
  win.setMenuBarVisibility(false);

  // Charger le site de streaming
  win.loadURL('https://senpai-stream.net/'); // Remplace par l'URL de ton choix
}

// Activer le bloqueur de publicités et de traqueurs
app.whenReady().then(() => {
  // Initialiser le bloqueur de publicités avec des listes de filtres prédéfinies
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(session.defaultSession);
  });

  createWindow();
});

// Bloquer les fenêtres pop-up non désirées
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Vérifier si l'URL fait partie du domaine autorisé
    const allowedDomain = 'senpai-stream.net'; // Remplace par le domaine de ton choix
    if (!url.includes(allowedDomain)) {
      return { action: 'deny' }; // Bloquer les URLs externes
    }
    return { action: 'allow' }; // Autoriser les URLs du domaine de streaming
  });
});

// Fermer l'application quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Sur macOS, réactiver la fenêtre si l'icône est cliquée dans le dock
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
