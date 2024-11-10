import PropTypes from "prop-types";

export const ExperiencePropTypes = PropTypes.shape({
      date: PropTypes.arrayOf(PropTypes.string).isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      points: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export const ContantTutorialPropTypes = PropTypes.shape({
      index: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      info: PropTypes.arrayOf(PropTypes.string).isRequired,
      additionalInfo: PropTypes.string.isRequired,
});