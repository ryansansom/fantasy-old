import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLength } from '../../lib/table-config/helpers';
import { getListConfig } from '../../redux/reducers';

const PlayerHeader = (props) => {
  const { listConfig } = props;
  const len = getLength(listConfig);
  return (
    <div className="header-row">
      {listConfig.map(({ header, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-header`}>{header}</div>)}
    </div>
  );
};

PlayerHeader.propTypes = {
  listConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
  listConfig: getListConfig(state),
});

export default connect(mapStateToProps)(PlayerHeader);
