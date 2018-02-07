<template>
  <div class="header">
    <h1>{{ msg }}</h1>

    <p><em>Friendly reminder:
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.header h1, .header h2 {
  font-weight: normal;
}
.header a {
  color: #42b983;
}

.header .tag {
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 3px;
  color: #4a4a4a;
  //display: inline-flex;
  font-size: .75rem;
  justify-content: center;
  line-height: 1.5;
  padding-top: 0.5em;
  margin-top: -0.5em;
  padding-bottom: 0.5em;
  margin-bottom: -0.5em;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
}

.selectedFilters .multiselect__tag {
  background: gray;
  outline: none;
  color: white;
}
.selectedFilters .multiselect__tag-icon:hover {
  background: #666;
}
.selectedFilters .multiselect__tag-icon:after {
  color: #666;
}
.selectedFilters .multiselect__tag-icon:hover:after {
  color: white;
}
@media (min-width: 500px) {
  .choices {
    margin-top: .5em;
  }
  .roundedOne {
    margin: .5em 0 0 0;
  }

}
@media (max-width: 499px) {
  .choices {
    margin-top: .5rem;
  }
  h3, h2, p {
    margin: 0;
  }
  h2 {
    padding-top: 2em;
    padding-bottom: .25em;
  }
  .hide-sm {
    display: none;
  }
}

.footnote {
  text-decoration: none;
  font-size: .7em;
  vertical-align: top;
  border-bottom: 1px dotted #004b6b;
}
.hidden {
  display: none;
}
</style>
