import Accordion from '../accordion';
import { connect } from 'react-redux';
import { modalState, updateCols } from '../../redux/actions';
import { postColumnCookie } from '../../lib/internal-api';
import { getLength } from '../../lib/table-config/helpers';
import PlayerList from '../player-list';
import React, { Component, PropTypes } from 'react';
import * as classicTableConfig from '../../lib/table-config/classic-table';
import * as playerListConfig from '../../lib/table-config/player-list';
import ColumnModal from '../modals/column-configuration';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

function buildConfigFromProps(config, arr) {
  if (arr[0] && arr[0].func) return arr;
  return arr.map(cfg => {
    const matchKey = Object.keys(config).find(cfgKey => config[cfgKey].header === cfg.header);
    return config[matchKey];
  });
}

// function checkConfigChange(oldConfig, newConfig) {
//   if (oldConfig.length !== newConfig.length) return true;
//
//   for (let i = 0, len = oldConfig.length; i < len; i++) {
//     if (oldConfig[i].header !== newConfig[i].header) return true;
//   }
//
//   return false;
// }

class ClassicTable extends Component {
  static propTypes = {
    columns: PropTypes.object.isRequired, // Could do shape...
    entries: PropTypes.array.isRequired,
    modalOpen: PropTypes.string.isRequired,
    sortFunc: PropTypes.func
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints)
  };

  constructor(props) {
    super(props);
    this.props.columns.playerCols = buildConfigFromProps(playerListConfig, props.columns.playerCols);
    this.props.columns.tableCols = buildConfigFromProps(classicTableConfig, props.columns.tableCols);
  }

  closeModal(body) {
    // Compare new config with old and post if changed. - NOT WORKING, PROPS SEEM TO UPDATE MID STATE CHANGE
    // const tableColChange = checkConfigChange(this.props.columns.tableCols, body.newConfig.tableCols);
    // const playerColChange = checkConfigChange(this.props.columns.playerCols, body.newConfig.playerCols);
    // let action;
    // if (tableColChange || playerColChange) action = postColumnCookie(body.newConfig).then(() => body.newConfig);

    this.props.modalState('', 'CLOSE', postColumnCookie(body.newConfig));
  }

  renderHeader() {
    const { tableCols } = this.props.columns;
    const len = getLength(tableCols);
    return <div className="header-row">
      {tableCols.map(({header, colSpan}, i) => <div key={i} className={`col-${colSpan || 1}-of-${len} table-header table-format`}>{header}</div>)}
    </div>;
  }

  renderList() {
    const { entries, sortFunc, columns: { tableCols } } = this.props;
    const len = getLength(tableCols);

    const entryList = entries
      .sort(sortFunc)
      .map((entry, i) => {
        const entryRow = <div>
          {tableCols.map(({func, colSpan}, j) => <div key={j} className={`col-${colSpan || 1}-of-${len} table-format`}>{func(entry, i)}</div>)}
        </div>;

        return (
          <Accordion
            tag="li"
            key={entry.entry}
            classes="entry-li"
            title={entry.entry.toString()}
            header={entryRow}>
            <PlayerList accordionKey={entry.entry + "--configure"} listConfig={this.props.columns.playerCols} players={entry.players} />
          </Accordion>
        )
      });
    return (
      <ul className="table-list">
        {entryList}
      </ul>
    );
  }

  onTableConfigChange(e) {
    const { playerCols, tableCols } = this.props.columns;
    const columnIndex = tableCols.findIndex(cfg => cfg.header === classicTableConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      tableCols.splice(columnIndex, 1);
      this.props.updateCols({tableCols, playerCols});
    } else {
      e.target.checked = false;
      tableCols.push(classicTableConfig[e.target.value]);
      this.props.updateCols({tableCols, playerCols});
    }
  }

  onListConfigChange(e) {
    const { playerCols, tableCols } = this.props.columns;
    const columnIndex = playerCols.findIndex(cfg => cfg.header === playerListConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      playerCols.splice(columnIndex, 1);
      this.props.updateCols({tableCols, playerCols});
    } else {
      e.target.checked = false;
      playerCols.push(playerListConfig[e.target.value]);
      this.props.updateCols({tableCols, playerCols});
    }
  }

  render() {
    return (
      <div className="classic-standings">
        { this.renderHeader() }
        { this.renderList() }
        {this.props.modalOpen ? <ColumnModal
          closeModal={::this.closeModal}
          onTableConfigChange={::this.onTableConfigChange}
          onListConfigChange={::this.onListConfigChange}
          listConfig={this.props.columns.playerCols}
          tableConfig={this.props.columns.tableCols} /> : null}
      </div>
    );
  }
}

function mapStateToProps({ columns, modalOpen }) {
  return { columns, modalOpen }
}

export default connect(mapStateToProps, { modalState, updateCols })(ClassicTable);
