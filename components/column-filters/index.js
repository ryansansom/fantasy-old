import React from 'react';
import PropTypes from 'prop-types';
import Accordion from '../accordion';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

const ColumnFilters = (props) => {
  const columnContent = Object.keys(props.config).map((key) => {
    const columnConfig = props.config[key];
    const columnFilterId = `column-filter-${key}`;
    return (
      <label className="filter" key={key} htmlFor={columnFilterId}>
        <input
          id={columnFilterId}
          type="checkbox"
          className="checkbox"
          onChange={props.toggle}
          value={key}
          checked={props.listConfig.some(cfg => cfg.header === columnConfig.header)}
        />
        <span>
          {columnConfig.header}
        </span>
      </label>
    );
  });

  return (
    <Accordion
      classes="column-filters"
      header={<div className="configure-columns--toggle button">Configure columns</div>}
      title={props.accordionKey}
    >
      {columnContent}
    </Accordion>
  );
};

ColumnFilters.propTypes = {
  accordionKey: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired, // Dynamic keys?
  listConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggle: PropTypes.func.isRequired,
};

export default ColumnFilters;
