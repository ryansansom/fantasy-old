import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../redux/connect-deep-compare';
import { getLength } from '../../lib/table-config/helpers';
import { getPlayerConfigWithData } from '../../redux/reducers';

const PlayerLine = (props) => {
  const { listConfig, playerId } = props;
  const len = getLength(listConfig);
  return (
    <li key={playerId}>
      {listConfig.map(({ header, data, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} player-picks-format`}>{data}</div>)}
    </li>
  );
};

PlayerLine.propTypes = {
  listConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  playerId: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  listConfig: getPlayerConfigWithData(state, ownProps),
});

export default connect(mapStateToProps)(PlayerLine);
