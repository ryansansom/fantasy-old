import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../redux/connect-deep-compare';
import Accordion from '../accordion';
import { getLength } from '../../lib/table-config/helpers';
import PlayerList from '../player-list';
import { getTableConfigWithData } from '../../redux/reducers';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

const PlayerListContainer = (props) => {
  const { tableCols, entryId, leagueId } = props;
  const len = getLength(tableCols); // Could pass in

  const entryRow = (
    <div>
      {tableCols.map(({ header, data, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-format`}>{data}</div>)}
    </div>
  );

  return (
    <Accordion
      tag="li"
      key={entryId}
      classes="entry-li"
      title={entryId.toString()}
      header={entryRow}
    >
      <PlayerList
        accordionKey={`${entryId}--configure`}
        entryId={entryId}
        leagueId={leagueId}
      />
    </Accordion>
  );
};

PlayerListContainer.propTypes = {
  entryId: PropTypes.number.isRequired,
  leagueId: PropTypes.string.isRequired,
  tableCols: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  tableCols: getTableConfigWithData(state, ownProps),
});
export default connect(mapStateToProps)(PlayerListContainer);
