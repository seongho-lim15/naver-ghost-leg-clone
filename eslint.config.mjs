import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", // 또는 "off"로 비활성화
        {
          args: "none", // 매개변수는 무시
          varsIgnorePattern: "^_", // "_"로 시작하는 변수는 무시
        },
      ],
    },
  },
];

export default eslintConfig;
