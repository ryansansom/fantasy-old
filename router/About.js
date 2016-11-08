import React from 'react'

if (process.env.CLIENT_RENDER) {
  require('./styles2.less')
}

export default class About extends React.Component {
  render() {
    return <div className='about'>About</div>
  }
}
