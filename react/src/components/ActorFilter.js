import React from 'react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class ActorFilter extends React.Component {
  render() {
    return (
      <span style={{ textAlign: 'left' }}>
      <Select
        name="selected-actors"
        multi
        simpleValue
        options={this.props.actors_select}
        value={this.props.selectedActors.length ? this.props.selectedActors : ""}
        placeholder="Lookup by Place/Project/Company - e.g. tmuxp, Social Amp, The Tao of tmux"
        onChange={this.props.onSelectedActorChange}
      />
      <Select
        name="selected-activity-types"
        multi
        simpleValue
        options={this.props.activityTypes_select}
        value={this.props.selectedActivityTypes.length ? this.props.selectedActivityTypes : ""}
        placeholder="Filter by Activity Type(s) - e.g. Work, Open Source, Website, Volunteering"
        onChange={this.props.onSelectedActivityTypesChange}
      />
      <Select
        name="selected-languages"
        multi
        simpleValue
        options={this.props.languages_select}
        value={this.props.selectedLanguages.length ? this.props.selectedLanguages : ""}
        placeholder="Filter by Programming Language(s) - e.g. Python, JavaScript, C++"
        onChange={this.props.onSelectedLanguageChange}
      />
      </span>
    );
  }
}

export default ActorFilter
