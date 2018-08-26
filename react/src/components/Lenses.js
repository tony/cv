import React from 'react'
import Select from 'react-select';
import { connect } from 'react-redux';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import { mapStateToProps, mapDispatchToProps } from '../containers/ActivityList.js';


class Lenses extends React.Component {
  render() {
    return (
      <div className="row lenses"><div className="col-xs-10 col-xs-offset-1" style={{ textAlign: 'left' }}>
      <Select
        name="selected-actors"
        isMulti
        options={this.props.availableActors_select}
        placeholder="Lookup by Place/Project/Company - e.g. tmuxp, Social Amp, The Tao of tmux"
        onChange={this.props.onSelectedActorChange}
      />
      <Select
        name="selected-activity-types"
        isMulti
        options={this.props.activityTypes_select}
        placeholder="Filter by Activity Type(s) - e.g. Work, Open Source, Website, Volunteering"
        onChange={this.props.onSelectedActivityTypesChange}
      />
      <Select
        name="selected-languages"
        isMulti
        options={this.props.languages_select}
        filterOption={this.props.filterAvailableLanguages}
        value={this.props.selectedLanguages_select}
        placeholder="Filter by Programming Language(s) - e.g. Python, JavaScript, C++"
        onChange={this.props.onSelectedLanguageChange}
      />
      <CheckboxGroup name="selected-filters"
        value={this.props.selectedFilters}
        onChange={this.props.onSelectedFiltersChange}
        style={{ textAlign: 'center' }}
        className="row choices"
        checkboxDepth={3}
      >
         {Object.keys(this.props.filters).map(filterChoice => (
          <div className="col-sm" key={filterChoice}><div className="box">
            <Checkbox value={filterChoice} id={filterChoice} />
            <label htmlFor={filterChoice}>
              <span>{filterChoice}</span>
            </label>
          </div></div>
        ))}
      </CheckboxGroup>
    </div></div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lenses);
