import React from 'react'
import { Link } from 'react-router'

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

export default class About extends React.Component {
  render() {
    return (<div className='about'>
      <span>Go to...</span>
      <Link to='/'>Home</Link>
    </div>)
  }
}
