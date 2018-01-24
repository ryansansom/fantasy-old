import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateCols } from '../../../redux/actions';
import * as classicTableConfig from '../../../lib/table-config/classic-table';
import * as playerListConfig from '../../../lib/table-config/player-list';
import ColumnFilters from '../../column-filters';
import { postColumnCookie } from '../../../lib/internal-api';
import { getListConfig, getTableConfig } from '../../../redux/reducers';

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

  const onTableConfigChange = (e) => {
    const { tableConfig: tableCols } = props;
    const columnIndex = tableCols.findIndex(cfg => cfg.header === classicTableConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      tableCols.splice(columnIndex, 1);
      props.updateCols({ tableCols });
    } else {
      e.target.checked = false;
      tableCols.push(classicTableConfig[e.target.value]);
      props.updateCols({ tableCols });
    }
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
            toggle={onTableConfigChange}
          />
          <h3 className="modal--header">Player List Column Configuration</h3>
          <p className="modal--content">Changes are applied and saved automatically</p>
          <ColumnFilters
            accordionKey="player-list"
            config={playerListConfig}
            listConfig={props.listConfig}
            toggle={onListConfigChange}
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
  tableConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateCols: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  listConfig: getListConfig(state),
  tableConfig: getTableConfig(state),
});

export default connect(mapStateToProps, { updateCols })(ColumnModal);
