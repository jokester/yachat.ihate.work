/// <reference types="@types/node" />
import { defineConfig } from "tsup";
import path from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: "iife",
  shims: true,
  minify: process.env.NODE_ENV === "production",
  inject: ["src/_util/react-import.ts"], // to not import React in each file
  noExternal: ["", /.*/, "combined-streams"],

  tsconfig: "tsconfig.browser.json",
  env: {
    NODE_ENV: process.env.NODE_ENV ?? "development",
  },
  outDir: path.join(__dirname, "public/static"),
});

throw new Error("not used");
