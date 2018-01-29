import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getListConfig } from '../../redux/reducers';
import { updateCols } from '../../redux/actions';
import * as playerListConfig from '../../lib/table-config/player-list';
import ColumnFilters from './index';

const PlayerColumnFilters = (props) => {
  const onListConfigChange = (e) => {
    const { listConfig: playerCols } = props;
    const columnIndex = playerCols.findIndex(cfg => cfg.header === playerListConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      playerCols.splice(columnIndex, 1);
      props.updateCols({ playerCols });
    } else {
      e.target.checked = false;
      playerCols.push(playerListConfig[e.target.value]);
      props.updateCols({ playerCols });
    }
  };

  return (
    <ColumnFilters
      accordionKey="player-list"
      config={playerListConfig}
      listConfig={props.listConfig}
      toggle={onListConfigChange}
    />
  );
};

PlayerColumnFilters.propTypes = {
  listConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateCols: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  listConfig: getListConfig(state),
});

export default connect(mapStateToProps, { updateCols })(PlayerColumnFilters);
