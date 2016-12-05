import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { updatePage } from '../../../redux/actions';

const pageName = 'PickLeague';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class PickLeague extends React.Component {
  static fetchData() {
    // Eventually fetch the data needed to generate league list
    return Promise.resolve(updatePage(pageName));
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
