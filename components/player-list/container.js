import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordion from '../accordion';
import { getLength } from '../../lib/table-config/helpers';
import PlayerList from '../player-list';
import { getEntry, getTableConfig } from '../../redux/reducers';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class PlayerListContainer extends Component {
  static propTypes = {
    entry: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    tableCols: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const { tableCols, entry, index } = this.props;
    const len = getLength(tableCols); // Could pass in

    const entryRow = (
      <div>
        {tableCols.map(({ header, func, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-format`}>{func(entry, index)}</div>)}
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
  }
}

const mapStateToProps = (state, ownProps) => ({
  entry: getEntry(state, ownProps),
  tableCols: getTableConfig(state),
});

export default connect(mapStateToProps)(PlayerListContainer);
