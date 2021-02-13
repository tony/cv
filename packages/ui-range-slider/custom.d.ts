/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.scss" {
  const content: any;
  export default content;
}

declare module "*.html" {
  const content: any;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    "range-slider": any;
  }
}

declare module "!!raw-loader!*" {
  const contents: string;
  export = contents;
}

declare module "!raw-loader!*" {
  const contents: string;
  export = contents;
}
