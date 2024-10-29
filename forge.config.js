module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon', // Ne spécifiez pas l'extension ici, Electron Forge ajoutera .ico automatiquement pour Windows
    extraResource: [],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: './assets/icon.ico', // Icône de l'installateur pour Windows
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
