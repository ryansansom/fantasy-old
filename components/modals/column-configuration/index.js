import React, { PropTypes } from 'react';
import * as classicTableConfig from '../../../lib/table-config/classic-table';
import * as playerListConfig from '../../../lib/table-config/player-list';
import ColumnFilters from '../../column-filters';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

const ColumnModal = (props) => {
  const closeModal = () => {
    props.closeModal({
      newConfig: {tableCols: props.tableConfig, playerCols: props.listConfig}
    });
  };

  return (
    <div>
      <div className="configure--wrapper" onClick={closeModal} />
      <div className="configure--modal">
        <div className="modal--wrapper">
          <h3 className="modal--header">Classic Table Column Configuration</h3>
          <p className="modal--content">Changes are applied and saved automatically</p>
          <ColumnFilters
            accordionKey="classic-table"
            config={classicTableConfig}
            listConfig={props.tableConfig}
            toggle={props.onTableConfigChange} />
          <h3 className="modal--header">Player List Column Configuration</h3>
          <p className="modal--content">Changes are applied and saved automatically</p>
          <ColumnFilters
            accordionKey="player-list"
            config={playerListConfig}
            listConfig={props.listConfig}
            toggle={props.onListConfigChange} />
          <a onClick={closeModal}>
            Close
          </a>
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
