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

.item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.align-octicon .octicon {
  vertical-align: text-top;
}
.align-octicon-bottom .octicon {
  vertical-align: initial;
}
h3.align-octicon-bottom .octicon {
  vertical-align: baseline;
}

@media (max-width: 499px) {
  .hide-sm {
    display: none;
  }
}

h2 {
  margin-top: 0;
}
</style>
