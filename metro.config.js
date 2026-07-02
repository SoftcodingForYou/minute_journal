// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// --- expo-sqlite on web (wa-sqlite) ---------------------------------------
// 1. Bundle the SQLite WebAssembly binary as an asset.
config.resolver.assetExts.push('wasm');

// 2. OPFS-backed persistence needs the page to be cross-origin isolated.
//    Set the required headers on the local dev server. Production hosting
//    must send the same two headers (see README / host config).
config.server = config.server ?? {};
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    middleware(req, res, next);
  };
};

module.exports = config;
