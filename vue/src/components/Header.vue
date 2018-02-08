<template>
  <div class="header">
    <h1>{{ msg }}</h1>

    <p><em>Friendly note:
      I don't do technical screens<a href="https://www.git-pull.com/blog/2018/01/technical-screening.html" target="_blank" class="hidden footnote">[1]</a>.
      Seeking remote, senior programming roles.
      I'm also available for <a href="https://www.git-pull.com/consulting/" target="_blank">consulting</a> and
    <a href="https://www.git-pull.com/mentoring/" target="_blank">mentoring</a>.</em></p>

    <Charts />
    <Lenses />
  </div>
</template>

<script>
import Charts from './Charts';
import Lenses from './Lenses';

export default {
  name: 'Header',
  components: { Charts, Lenses },
  data() {
    return {
      msg: 'Tony Narlock\'s CV',
    };
  },
};
</script>
