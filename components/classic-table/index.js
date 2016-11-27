import Accordion from '../accordion';
import { getLength } from '../../lib/table-config/helpers';
import PlayerList from '../player-list';
import React, { Component, PropTypes } from 'react';
import * as config from '../../lib/table-config/classic-table';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class ClassicTable extends Component {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    sortFunc: PropTypes.func,
    tableConfig: PropTypes.array
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints),
    tableConfig: [
      config.position,
      config.playerName,
      config.prevTotal,
      config.currPoints,
      config.projPoints,
      config.currTotal,
      config.projTotal
    ]
  };

  renderHeader() {
    const { tableConfig } = this.props;
    const len = getLength(tableConfig);
    return <div className="header-row">
      {tableConfig.map(({header, colSpan}, i) => <div key={i} className={`col-${colSpan || 1}-of-${len} table-header table-format`}>{header}</div>)}
    </div>;
  }

  renderList() {
    const { entries, sortFunc, tableConfig } = this.props;
    const len = getLength(tableConfig);

    const entryList = entries
      .sort(sortFunc)
      .map((entry, i) => {
        const entryRow = <div>
          {tableConfig.map(({func, colSpan}, j) => <div key={j} className={`col-${colSpan || 1}-of-${len} table-format`}>{func(entry, i)}</div>)}
        </div>;

        return (
          <Accordion
            tag="li"
            key={entry.entry}
            classes="entry-li"
            title={entry.entry.toString()}
            header={entryRow}>
            <PlayerList players={entry.players} />
          </Accordion>
        )
      });
    return (
      <ul className="table-list">
        {entryList}
      </ul>
    );
  }

  render() {
    return (
      <div className="classic-standings">
        { this.renderHeader() }
        { this.renderList() }
      </div>
    );
  }
}

export default ClassicTable;
