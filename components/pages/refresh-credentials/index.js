import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { updatePage } from '../../../redux/actions';

const pageName = 'Refresh Auth Token';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class PickLeague extends Component {
  static fetchData({ dispatch }) {
    return updatePage(pageName)(dispatch);
  }

  static propTypes = {
    page: PropTypes.string.isRequired,
    updatePage: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.updatePage(pageName);
  }

  render() {
    return (
      <div className="refresh-credentials">
        <form
          action="/api/refresh-credentials"
          method="post"
        >
          <label htmlFor="username">
            <span>Username: </span>
            <input id="username" type="text" name="username" />
          </label>
          <label htmlFor="password">
            <span>Password: </span>
            <input id="password" type="password" name="password" />
          </label>
          <label htmlFor="authCode">
            <span>Authorisation Code: </span>
            <input id="authCode" type="password" name="authCode" />
          </label>
          <button type="submit">Submit</button>
        </form>
        <div>
          <Link to="/">Back to home</Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ page }) {
  return { page };
}

export default hot(module)(connect(mapStateToProps, { updatePage })(PickLeague));
