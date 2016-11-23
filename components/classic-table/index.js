import Accordion from '../accordion';
import PlayerList from '../player-list';
import React, { Component, PropTypes } from 'react';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class ClassicTable extends Component {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    sortFunc: PropTypes.func,
    tableConfig: PropTypes.array.isRequired
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints)
  };

  renderHeader() {
    const len = this.props.tableConfig.length;
    return <div className="header-row">{this.props.tableConfig.map((data, i) => <div key={i} className={`col-1-of-${len} table-header table-format`}>{data.header}</div>)}</div>;
  }

  renderList() {
    const { entries, sortFunc, tableConfig } = this.props;
    const len = tableConfig.length;

    const entryList = entries
      .sort(sortFunc)
      .map((entry, i) => {
        const entryRow = <div>
          {tableConfig.map((data, j) => <div key={j} className={`col-1-of-${len} table-format`}>{data.func(entry, i)}</div>)}
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
