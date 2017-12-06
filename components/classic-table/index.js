import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordion from '../accordion';
import { updateCols } from '../../redux/actions';
import { getLength } from '../../lib/table-config/helpers';
import PlayerList from '../player-list';
import * as classicTableConfig from '../../lib/table-config/classic-table';
import * as playerListConfig from '../../lib/table-config/player-list';
import ColumnModal from '../modals/column-configuration';

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
    closeModal: PropTypes.func.isRequired,
    columns: PropTypes.shape({
      playerCols: PropTypes.array,
      tableCols: PropTypes.array,
    }).isRequired, // Could do shape...
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
    modalOpen: PropTypes.string.isRequired,
    sortFunc: PropTypes.func,
    updateCols: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints),
  };

  constructor(props) {
    super(props);
    this.playerCols = buildConfigFromProps(playerListConfig, props.columns.playerCols);
    this.tableCols = buildConfigFromProps(classicTableConfig, props.columns.tableCols);
  }

  onTableConfigChange = (e) => {
    const { playerCols, tableCols } = this;
    const columnIndex = tableCols.findIndex(cfg => cfg.header === classicTableConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      tableCols.splice(columnIndex, 1);
      this.props.updateCols({ tableCols, playerCols });
    } else {
      e.target.checked = false;
      tableCols.push(classicTableConfig[e.target.value]);
      this.props.updateCols({ tableCols, playerCols });
    }
  };

  onListConfigChange = (e) => {
    const { playerCols, tableCols } = this;
    const columnIndex = playerCols.findIndex(cfg => cfg.header === playerListConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      playerCols.splice(columnIndex, 1);
      this.props.updateCols({ tableCols, playerCols });
    } else {
      e.target.checked = false;
      playerCols.push(playerListConfig[e.target.value]);
      this.props.updateCols({ tableCols, playerCols });
    }
  };

  renderHeader() {
    const { tableCols } = this;
    const len = getLength(tableCols);
    return (
      <div className="header-row">
        {tableCols.map(({ header, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-header table-format`}>{header}</div>)}
      </div>
    );
  }

  renderList() {
    const { entries, sortFunc } = this.props;
    const { tableCols } = this;
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
            <PlayerList accordionKey={`${entry.entry}--configure`} listConfig={this.playerCols} players={entry.players} />
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
        { this.props.modalOpen && (
          <ColumnModal
            closeModal={this.props.closeModal}
            onTableConfigChange={this.onTableConfigChange}
            onListConfigChange={this.onListConfigChange}
            listConfig={this.playerCols}
            tableConfig={this.tableCols}
          />
          )
        }
      </div>
    );
  }
}

function mapStateToProps({ columns }) {
  return { columns };
}

export default connect(mapStateToProps, { updateCols })(ClassicTable);
