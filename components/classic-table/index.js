import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordion from '../accordion';
import { getLength } from '../../lib/table-config/helpers';
import PlayerList from '../player-list';
import * as classicTableConfig from '../../lib/table-config/classic-table';
import Modals from '../modals/modals';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

function buildConfigFromProps(config, arr) {
  if (arr[0] && arr[0].func) return arr;
  return arr.map((cfg) => {
    const matchKey = Object.keys(config).find(cfgKey => config[cfgKey].header === cfg.header);
    return config[matchKey];
  });
}

class ClassicTable extends Component {
  static propTypes = {
    tableCols: PropTypes.arrayOf(PropTypes.object).isRequired,
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortFunc: PropTypes.func,
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints),
  };

  renderHeader() {
    const { tableCols } = this.props;
    const len = getLength(tableCols);
    return (
      <div className="header-row">
        {tableCols.map(({ header, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-header table-format`}>{header}</div>)}
      </div>
    );
  }

  renderList() {
    const { entries, sortFunc, tableCols } = this.props;
    const len = getLength(tableCols);

    const entryList = entries
      .sort(sortFunc)
      .map((entry, i) => {
        const entryRow = (
          <div>
            {tableCols.map(({ header, func, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-format`}>{func(entry, i)}</div>)}
          </div>
        );

        return (
          <Accordion
            tag="li"
            key={entry.entry}
            classes="entry-li"
            title={entry.entry.toString()}
            header={entryRow}
          >
            <PlayerList
              accordionKey={`${entry.entry}--configure`}
              players={entry.players}
            />
          </Accordion>
        );
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
        <Modals />
      </div>
    );
  }
}

const mapStateToProps = ({ tableCols }) => ({
  tableCols: buildConfigFromProps(classicTableConfig, tableCols),
});

export default connect(mapStateToProps)(ClassicTable);
