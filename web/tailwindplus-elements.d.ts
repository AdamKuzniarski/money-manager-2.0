import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "el-dropdown": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
