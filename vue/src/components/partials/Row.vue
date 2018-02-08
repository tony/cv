<template>
  <div class="row">
    <div class="col-md-10 col-md-offset-1 col-xs-12">
    <div class="box">
    <div class="row">
      <div class="col-md-4 col-xs-12 item"><div class="box">
      <slot name="left"></slot>
      </div></div>
      <div class="col-md-8 col-xs-12 item"><div class="box">
        <slot name="right"></slot>
      </div></div>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Row',
};
</script>
