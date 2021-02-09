/* eslint-disable @typescript-eslint/no-explicit-any,no-unused-vars */
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.scss" {
  const content: any;
  export default content;
}

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.html" {
  const content: any;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    "cv-nav": any;
  }
}
