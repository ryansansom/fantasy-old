import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../redux/connect-deep-compare';
import Modals from '../modals/modals';
import ClassicTableHeader from './header';
import PlayerListContainer from '../player-list/container';
import { getEntriesIds } from '../../redux/reducers';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class ClassicTable extends Component {
  static propTypes = {
    entryIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    leagueId: PropTypes.string.isRequired,
  };

  renderList() {
    const { entryIds } = this.props;

    const entryList = entryIds
      .map((id, index) => (
        <PlayerListContainer
          key={id}
          entryId={id}
          leagueId={this.props.leagueId}
          index={index}
        />
      ));
    return (
      <ul className="table-list">
        {entryList}
      </ul>
    );
  }

  render() {
    return (
      <div className="classic-standings">
        <ClassicTableHeader />
        { this.renderList() }
        <Modals />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  entryIds: getEntriesIds(state, ownProps),
});

export default connect(mapStateToProps)(ClassicTable);
