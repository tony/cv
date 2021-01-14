declare module "*.svg" {
  const content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    "cv-nav": any;
  }
}
