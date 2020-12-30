// https://github.com/visualfanatic/vue-svg-loader/blob/8ba74b8/docs/faq.md#how-to-use-this-loader-with-typescript
declare module "*.svg" {
  import Vue, { VueConstructor } from "vue";
  const content: VueConstructor<Vue>;
  export default content;
}
