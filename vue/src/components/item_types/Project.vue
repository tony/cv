<template>
  <div>I am async node3!</div>
</template>

<script>
export default new Promise((resolve) => { // (resolve, reject)
  setTimeout(() => {
    resolve({
      template: '<div>I am async node3!</div>',
      created: () => {
        // can we access props transferred into async component via component
        console.log(this.opts);
      },
    });
  }, 3000);
});
</script>

<style>
</style>
