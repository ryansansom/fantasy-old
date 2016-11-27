import React, {
  PropTypes,
} from 'react';

const ColumnFilters = (props) => {
  const columnContent = Object.keys(props.config).map(key => {
    const columnConfig = props.config[key];
    return <label key={key}>
      {columnConfig.header}
      <input type="checkbox" onChange={props.toggle} value={key} checked={!!props.listConfig.find(cfg => cfg.header === columnConfig.header)} />
    </label>
  });
  return (
    <div>
      {columnContent}
    </div>
  );
};

ColumnFilters.propTypes = {
  config: PropTypes.object.isRequired,
  listConfig: PropTypes.array.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default ColumnFilters;
