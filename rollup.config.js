import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

const mkConfig = (cfg) => {
  return {
    ...cfg,
    external: [],
    plugins: [
      typescript({
        tsconfigOverride: { compilerOptions: { module: "es2015" } },
        allowSyntheticDefaultImports: true,
        clean: process.env.ROLLUP_WATCH === undefined,
      }),
      !process.env.ROLLUP_WATCH && terser(),
      ...(cfg.plugins || []),
    ],
  };
};

export default async () => {
  return [
    mkConfig({
      input: "src/index.ts",
      output: [
        {
          name: "resizable",
          file: "dist/index.js",
          format: "umd",
        },
      ],
      plugins: [],
    }),
    mkConfig({
      input: "src/index.ts",
      output: [
        {
          file: "dist/es/index.js",
          format: "es",
        },
      ],
      plugins: [],
    }),
    mkConfig({
      input: "src/core.ts",
      output: [
        {
          file: "dist/es/composite/core.js",
          format: "es",
        },
      ],
      plugins: [],
    }),
    mkConfig({
      input: "src/utils/web-listener.ts",
      output: [
        {
          file: "dist/es/composite/web-listener.js",
          format: "es",
        },
      ],
      plugins: [],
    }),
  ];
};
