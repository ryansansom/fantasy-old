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
  static fetchData(dispatch) {
    // Eventually fetch the data needed to generate league list
    return leagueList(getLeagueList())(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.updatePage(pageName);
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

function mapStateToProps({ updating, page }) {
  return { updating, page }
}

export default connect(mapStateToProps, { updatePage })(PickLeague)
