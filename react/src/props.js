import PropTypes from 'prop-types';


const languageProp = {
  color: PropTypes.string,
  name: PropTypes.string.isRequired,
};

const actorProp = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  repo_url: PropTypes.string,
  type: PropTypes.string.isRequired,
  url: PropTypes.string,
  languages: PropTypes.arrayOf(
    PropTypes.shape(languageProp).isRequired
  ),
};

export const activityProp = {
  id: PropTypes.number.isRequired,
  component_name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actor: PropTypes.shape(actorProp).isRequired,
  featured: PropTypes.object,
  created_date: PropTypes.string.isRequired,
  accepted_date: PropTypes.string,
  end_date: PropTypes.string
};

export const activityListProp = {
  activities: PropTypes.arrayOf(
    PropTypes.shape(activityProp).isRequired
  ).isRequired,
}

export default activityProp;
