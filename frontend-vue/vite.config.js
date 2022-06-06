import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import fs from 'fs'
import path from 'path'

var httpsOptions = false;


// you can generate a HTTPS certificates with the scripts at ../certs
// you will need to 
//   export PASSPHRASE=$(security find-generic-password -a $USER -s myCApassphrase -w)
// before  running npm run dev
if (fs.existsSync(path.resolve(__dirname, '../certs/localhost.crt'))) {
  if (!process.env.PASSPHRASE) {
    console.log("The environment variable PASSPHRASE with the passphrase for the certificate key is not set. Exiting...")
    console.log("export PASSPHRASE=$(security find-generic-password -a $USER -s myCApassphrase -w)")
    process.exit(1)
  }

  httpsOptions = {
      key: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.crt')),
      passphrase: process.env.PASSPHRASE,
  }
}




// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    https: httpsOptions,
    proxy: {
      '/api': {
        target: `${httpsOptions ? 'https' : 'http'}://localhost:6000/`,
        changeOrigin: true,

      }
    },
    cors: false, // prevent vite from addind access-control-allow-origin: *
  }
});
