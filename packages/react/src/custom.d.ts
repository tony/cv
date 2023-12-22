/* eslint-disable @typescript-eslint/no-explicit-string */
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.html" {
  const content: string;
  export default content;
}

declare module "!!raw-loader!*" {
  const contents: string;
  export = contents;
}

declare module "!raw-loader!*" {
  const contents: string;
  export = contents;
}
