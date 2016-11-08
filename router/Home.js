import React from 'react'
import { Link } from 'react-router'

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

export default class Home extends React.Component {
  render() {
    return (<div className='home'>
      <span>Go to...</span>
      <Link to='/about'>About</Link>
    </div>);
  }
}
