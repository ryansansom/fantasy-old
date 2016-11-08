import React from 'react'

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

export default class Home extends React.Component {
  render() {
    return <div className='home'>Home</div>
  }
}
