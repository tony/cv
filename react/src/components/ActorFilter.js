import React from 'react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class ActorFilter extends React.Component {
  render() {
    console.log(this);
    return (
      <Select
        name="form-field-name"
        onChange={this.handleChange}
        options={this.props.actors_select}
        placeholder="Lookup by Place/Project/Company - e.g. tmuxp, Social Amp, The Tao of tmux"
      />
    );
  }
}

export default ActorFilter
