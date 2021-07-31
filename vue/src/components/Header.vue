<template>
  <div class="header">
    <h1>{{ msg }}</h1>

    <p><em>
      I appreciate when hiring managers look at my contributions and projects in lieu of
      technical screens, that let's us both know my strengths match the role!
    </em></p>

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
