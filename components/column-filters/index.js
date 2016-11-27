import Accordion from '../accordion';
import React, { PropTypes } from 'react';

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
    <Accordion
      classes="column-filters"
      header={<div className="configure-columns--toggle">Configure columns</div>}
      title={props.accordionKey} >
      {columnContent}
    </Accordion>
  );
};

ColumnFilters.propTypes = {
  accordionKey: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  listConfig: PropTypes.array.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default ColumnFilters;
