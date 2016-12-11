import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { updatePage, leagueList } from '../../../redux/actions';
import { getLeagueList } from '../../../lib/internal-api';

const pageName = 'PickLeague';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class PickLeague extends React.Component {
  static fetchData(dispatch, { leaguesList }) {
    // Eventually fetch the data needed to generate league list
    return leagueList(Promise.resolve(leaguesList), pageName)(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) {
      this.props.leagueList(getLeagueList(), pageName);
    }
  }

  render() {
    return (
      this.props.updating ?
      <span>Updating</span>
      :
      <div className='pick-league'>
        <Link to='/standings'>STANDINGS</Link>
        <span>{`I am the pick league page`}</span>
      </div>);
  }
}

function mapStateToProps({ updating, leaguesList, page }) {
  return { updating, leaguesList, page }
}

export default connect(mapStateToProps, { leagueList })(PickLeague)
