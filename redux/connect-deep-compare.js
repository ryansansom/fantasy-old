import { connect as reduxConnect } from 'react-redux';
import deepEqual from 'deep-equal';

export function connect(
  mapStateToProps,
  mapDispatchToProps,
  ownProps,
  options,
) {
  return reduxConnect(mapStateToProps, mapDispatchToProps, ownProps, {
    areStatePropsEqual: deepEqual,
    ...options,
  });
}
