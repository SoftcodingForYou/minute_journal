import "react-i18next";

import type { Strings } from "./en";

// Makes the `t()` function aware of our exact string keys.
declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: Strings };
    returnNull: false;
  }
}
