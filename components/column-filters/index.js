import React, {
  PropTypes,
} from 'react';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

const ColumnFilters = (props) => {
  const columnContent = Object.keys(props.config).map(key => {
    const columnConfig = props.config[key];
    return <label className="filter" key={key}>
      <input
        type="checkbox"
        className="checkbox"
        onChange={props.toggle}
        value={key}
        checked={!!props.listConfig.find(cfg => cfg.header === columnConfig.header)} />
      <span>
        {columnConfig.header}
      </span>
    </label>
  });
  return (
    <div className="column-filters">
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
