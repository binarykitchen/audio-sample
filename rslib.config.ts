import path from "node:path";

import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { defineConfig } from "@rslib/core";

const rootDir = process.cwd();

const resolvePath = (relativePath: string) => path.resolve(rootDir, relativePath);

const srcDir = resolvePath("src");
const tsConfig = resolvePath("tsconfig.build.json");
const tsEntry = resolvePath(path.join(srcDir, "index.ts"));

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2020",
      dts: true,
      output: {
        distPath: {
          root: "./dist/esm/",
        },
      },
    },
    {
      format: "cjs",
      syntax: "es2015",
      output: {
        // This will include all the JS code into one single file without
        // the use of require()
        autoExternal: false,
        distPath: {
          root: "./dist/cjs/",
        },
      },
    },
    {
      format: "umd",
      umdName: "audio-sample",
      output: {
        // This will include all the JS code into one single file without
        // the use of require()
        autoExternal: false,
        distPath: {
          root: "./dist/umd/",
        },
      },
    },
  ],
  mode: "production",
  output: {
    target: "web",
    legalComments: "none",
  },
  source: {
    entry: {
      index: tsEntry,
    },
    tsconfigPath: tsConfig,
  },
  plugins: [pluginNodePolyfill()],
  tools: {
    htmlPlugin: false,
    rspack: (_config, { appendPlugins }) => {
      // To run this, use the `npm run build:prod:doc` command
      if (process.env["RSDOCTOR"]) {
        appendPlugins(
          new RsdoctorRspackPlugin({
            // plugin options
          }),
        );
      }
    },
  },
});
