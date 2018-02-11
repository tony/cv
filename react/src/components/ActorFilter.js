import React from 'react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class ActorFilter extends React.Component {
  render() {
    console.log(this);
    return (
      <Select
        name="form-field-name"
        value={this.props}
        onChange={this.handleChange}
        options={this.props.actors_select}
      />
    );
  }
}

export default ActorFilter
