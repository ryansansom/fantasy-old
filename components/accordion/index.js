import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

export default class Accordion extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.string,
    header: PropTypes.node.isRequired,
    tag: PropTypes.node,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    tag: 'div'
  };

  renderHeader(id) {
    return (
      <label className='accordion--label' htmlFor={id}>
        <div className='accordion--title'>
          {this.props.header}
        </div>
      </label>
    );
  }

  renderAccordionContent() {
    return (
      <div className='accordion--content'>
        {this.props.children}
      </div>
    );
  }

  render() {
    const id = this.props.title;
    const Tag = this.props.tag;
    return (
      <Tag className={classnames('accordion', this.props.classes)}>
        <input
          className='accordion--toggle'
          id={id}
          type='checkbox' />
        {this.renderHeader(id)}
        {this.renderAccordionContent()}
      </Tag>
    );
  }
}
