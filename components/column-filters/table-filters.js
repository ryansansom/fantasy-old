import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTableConfig } from '../../redux/reducers';
import { updateCols } from '../../redux/actions';
import * as classicTableConfig from '../../lib/table-config/classic-table';
import ColumnFilters from './index';

const TableColumnFilters = (props) => {
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
    <ColumnFilters
      accordionKey="classic-table"
      config={classicTableConfig}
      listConfig={props.tableConfig}
      toggle={onTableConfigChange}
    />
  );
};

TableColumnFilters.propTypes = {
  tableConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateCols: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tableConfig: getTableConfig(state),
});

export default connect(mapStateToProps, { updateCols })(TableColumnFilters);
