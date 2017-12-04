import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { updatePage } from '../../../redux/actions';

const pageName = 'Refresh Auth Token';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class PickLeague extends Component {
  static fetchData(dispatch) {
    return updatePage(pageName)(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.updatePage(pageName);
  }

  render() {
    return (
      <div className="refresh-credentials">
        <form action="/api/refresh-credentials" method="post">
          <label>Username: </label>
          <input type="text" name="username" />
          <label>Password: </label>
          <input type="text" name="password" />
          <label>Authorisation Code: </label>
          <input type="text" name="authCode" />
          <button type="submit">Submit</button>
        </form>
        <div>
          <Link to="/">Back to home</Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ updating, page }) {
  return { updating, page };
}

export default connect(mapStateToProps, { updatePage })(PickLeague);
