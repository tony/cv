<template>
  <div class="row">
    <div class="col-xs-10 col-xs-offset-1">
    <div class="box">
    <div class="row">
      <div class="col-xs-4 item"><div class="box">
      <slot name="left"></slot>
      </div></div>
      <div class="col-xs-8 item"><div class="box">
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

<style>
.tag {
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 3px;
  color: #4a4a4a;
  display: inline-flex;
  font-size: .75rem;
  justify-content: center;
  line-height: 1.5;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
}
</style>
