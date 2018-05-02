import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLength } from '../../lib/table-config/helpers';
import { getTableConfig } from '../../redux/reducers';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

const ClassicTableHeader = (props) => {
  const { tableCols } = props;
  const len = getLength(tableCols);

  return (
    <div className="header-row">
      {tableCols.map(({ header, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-header table-format`}>{header}</div>)}
    </div>
  );
};

ClassicTableHeader.propTypes = {
  tableCols: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
  tableCols: getTableConfig(state),
});

export default connect(mapStateToProps)(ClassicTableHeader);
