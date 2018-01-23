import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { closeModal } from '../../../redux/actions';
import ColumnModal from '../column-configuration';

const mapStateToProps = ({ modalOpen }) => ({
  modalOpen,
});

const Modals = (props) => {
  const { modalOpen, ...otherProps } = props;
  switch (modalOpen) {
    case 'COLUMNS':
      return <ColumnModal {...otherProps} />;
    default:
      return null;
  }
};

Modals.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, { closeModal })(Modals);
