import Accordion from '../accordion';
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
  return arr.map(cfg => {
    const matchKey = Object.keys(config).find(cfgKey => config[cfgKey].header === cfg.header);
    return config[matchKey];
  });
}

class ClassicTable extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    entries: PropTypes.array.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    sortFunc: PropTypes.func,
    tableConfig: PropTypes.array,
    listConfig: PropTypes.array
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints)
  };

  constructor(props) {
    super(props);
    this.state = {
      listConfig: buildConfigFromProps(playerListConfig, props.listConfig),
      tableConfig: buildConfigFromProps(classicTableConfig, props.tableConfig)
    };
  }

  renderHeader() {
    const { tableConfig } = this.state;
    const len = getLength(tableConfig);
    return <div className="header-row">
      {tableConfig.map(({header, colSpan}, i) => <div key={i} className={`col-${colSpan || 1}-of-${len} table-header table-format`}>{header}</div>)}
    </div>;
  }

  renderList() {
    const { tableConfig } = this.state;
    const { entries, sortFunc } = this.props;
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
            <PlayerList accordionKey={entry.entry + "--configure"} listConfig={this.state.listConfig} players={entry.players} />
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
    const { tableConfig } = this.state;
    const columnIndex = tableConfig.findIndex(cfg => cfg.header === classicTableConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      tableConfig.splice(columnIndex, 1);
      this.setState({
        tableConfig
      });
    } else {
      e.target.checked = false;
      tableConfig.push(classicTableConfig[e.target.value]);
      this.setState({
        tableConfig
      });
    }
  }

  onListConfigChange(e) {
    const { listConfig } = this.state;
    const columnIndex = listConfig.findIndex(cfg => cfg.header === playerListConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      listConfig.splice(columnIndex, 1);
      this.setState({
        listConfig
      });
    } else {
      e.target.checked = false;
      listConfig.push(playerListConfig[e.target.value]);
      this.setState({
        listConfig
      });
    }
  }

  render() {
    return (
      <div className="classic-standings">
        { this.renderHeader() }
        { this.renderList() }
        {this.props.modalOpen ? <ColumnModal
          closeModal={this.props.closeModal}
          onTableConfigChange={::this.onTableConfigChange}
          onListConfigChange={::this.onListConfigChange}
          listConfig={this.state.listConfig}
          tableConfig={this.state.tableConfig}/> : null}
      </div>
    );
  }
}

export default ClassicTable;
