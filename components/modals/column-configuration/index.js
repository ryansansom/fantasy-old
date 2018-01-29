import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { postColumnCookie } from '../../../lib/internal-api';
import { getListConfig, getTableConfig } from '../../../redux/reducers';
import TableColumnFilters from '../../column-filters/table-filters';
import PlayerColumnFilters from '../../column-filters/player-filters';

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
          <TableColumnFilters />
          <h3 className="modal--header">Player List Column Configuration</h3>
          <p className="modal--content">Changes are applied and saved automatically</p>
          <PlayerColumnFilters />
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
};

const mapStateToProps = state => ({
  listConfig: getListConfig(state),
  tableConfig: getTableConfig(state),
});

export default connect(mapStateToProps)(ColumnModal);
