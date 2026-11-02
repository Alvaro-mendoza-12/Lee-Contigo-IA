import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // These effects restore browser preferences after SSR or reset route state.
    // Keep this allowance scoped; the rest of the Hooks rules remain enabled.
    files: [
      "components/barra-xp.tsx",
      "components/celebracion-xp.tsx",
      "components/guardia-cuento.tsx",
      "components/library.tsx",
      "components/reader.tsx",
      "components/reading-help.tsx",
      "components/tutorial.tsx",
      "components/use-narration.ts",
      "components/use-reading-font.ts",
      "components/use-page-animation.ts",
    ],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  {
    // Saved images are validated data URLs or scene atlases, sized in the reader.
    files: [
      "components/book-shelf.tsx",
      "components/generated-scene.tsx",
      "components/story-creator.tsx",
    ],
    rules: { "@next/next/no-img-element": "off" },
  },
  globalIgnores([
    ".next/**",
    "next-env.d.ts",
    "output/**",
    "artifacts/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
