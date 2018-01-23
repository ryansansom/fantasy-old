import React from 'react';
import PropTypes from 'prop-types';
import * as classicTableConfig from '../../../lib/table-config/classic-table';
import * as playerListConfig from '../../../lib/table-config/player-list';
import ColumnFilters from '../../column-filters';
import { postColumnCookie } from '../../../lib/internal-api';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

const ColumnModal = (props) => {
  const closeModal = () => {
    postColumnCookie({
      tableCols: props.tableConfig,
      playerCols: props.listConfig,
    });

    props.closeModal();
  };

  return (
    <div>
      <div
        className="configure--wrapper"
        role="presentation"
        onClick={closeModal}
        onKeyPress={closeModal}
      />
      <div className="configure--modal">
        <div className="modal--wrapper">
          <h3 className="modal--header">Classic Table Column Configuration</h3>
          <p className="modal--content">Changes are applied and saved automatically</p>
          <ColumnFilters
            accordionKey="classic-table"
            config={classicTableConfig}
            listConfig={props.tableConfig}
            toggle={props.onTableConfigChange}
          />
          <h3 className="modal--header">Player List Column Configuration</h3>
          <p className="modal--content">Changes are applied and saved automatically</p>
          <ColumnFilters
            accordionKey="player-list"
            config={playerListConfig}
            listConfig={props.listConfig}
            toggle={props.onListConfigChange}
          />
          <button onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ColumnModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  listConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTableConfigChange: PropTypes.func.isRequired,
  onListConfigChange: PropTypes.func.isRequired,
  tableConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ColumnModal;
