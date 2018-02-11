import React from 'react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class ActorFilter extends React.Component {
  render() {
    return (
      <Select
        name="form-field-name"
        multi
        simpleValue
        options={this.props.actors_select}
        value={this.props.selectedActors_select.length ? this.props.selectedActors_select : ""}
        placeholder="Lookup by Place/Project/Company - e.g. tmuxp, Social Amp, The Tao of tmux"
        onChange={this.props.onSelectedActorChange}
      />
    );
  }
}

export default ActorFilter
