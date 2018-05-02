import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLastUpdated, getUpdatingStatus } from '../../redux/reducers';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class StandingsStatusInfo extends React.PureComponent {
  render() {
    return (
      <div className="update-info__wrapper">
        <span className="update-info col-1-of-2">
          { `Last updated at: ${
            this.props.lastUpdated
              ? new Date(this.props.lastUpdated).toLocaleTimeString(undefined, { timeZoneName: 'short' })
              : 'Never'
            }`
          }
        </span>
        <span className="update-info col-1-of-2">
          { this.props.updating ? 'Getting latest standings...' : 'Latest standings applied' }
        </span>
      </div>
    );
  }
}

StandingsStatusInfo.propTypes = {
  lastUpdated: PropTypes.number.isRequired,
  updating: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  lastUpdated: getLastUpdated(state, ownProps),
  updating: getUpdatingStatus(state, ownProps),
});

export default connect(mapStateToProps)(StandingsStatusInfo);
