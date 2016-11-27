import React, { PropTypes } from 'react';
import * as classicTableConfig from '../../../lib/table-config/classic-table';
import * as playerListConfig from '../../../lib/table-config/player-list';
import ColumnFilters from '../../column-filters';

const ColumnModal = (props) => {
  return (
    <div>
      <div className="configure--wrapper" onClick={props.closeModal} />
      <div className="configure--modal">
        <div className="modal--wrapper">
          <h3>Classic Table Column Configuration</h3>
          <ColumnFilters
            accordionKey="classic-table"
            config={classicTableConfig}
            listConfig={props.tableConfig}
            toggle={props.onTableConfigChange} />
          <h3>Player List Column Configuration</h3>
          <ColumnFilters
            accordionKey="player-list"
            config={playerListConfig}
            listConfig={props.listConfig}
            toggle={props.onListConfigChange} />
        </div>
      </div>
    </div>
  );
};

ColumnModal.propTypes = {
  listConfig: PropTypes.array.isRequired,
  onTableConfigChange: PropTypes.func.isRequired,
  onListConfigChange: PropTypes.func.isRequired,
  tableConfig: PropTypes.array.isRequired
};

export default ColumnModal;
