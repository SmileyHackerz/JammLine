const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Regarder dans tout le monorepo
config.watchFolders = [workspaceRoot];

// 2. Chercher dans les node_modules locaux PUIS globaux
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. L'ARME FATALE : L'intercepteur de résolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Si N'IMPORTE QUEL fichier demande "react" ou ses sous-dossiers (comme react/jsx-runtime)
  if (moduleName === "react" || moduleName.startsWith("react/")) {
    // On trompe Metro en lui disant : "Fais comme si l'import venait de l'application Expo directement"
    const modifiedContext = {
      ...context,
      originModulePath: path.join(projectRoot, "App.js"),
    };
    return context.resolveRequest(modifiedContext, moduleName, platform);
  }

  // Pour le reste, comportement normal
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
