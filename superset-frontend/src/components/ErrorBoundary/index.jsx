// DODO was here
import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/core';
import ErrorMessageWithStackTrace from 'src/components/ErrorMessage/ErrorMessageWithStackTrace';
import { FirebaseService } from 'src/firebase'; // Import FirebaseService

const propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  showMessage: PropTypes.bool,
};
const defaultProps = {
  onError: () => {},
  showMessage: true,
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    if (this.props.onError) this.props.onError(error, info);

    // eslint-disable-next-line no-underscore-dangle
    const erroredFile = this.props?.children?._source
      ? // eslint-disable-next-line no-underscore-dangle
        this.props?.children?._source?.fileName
      : null;

    // Log the error to Firestore
    const errorDetails = {
      message: error.message || 'No message available',
      stack: error.stack || 'No stack trace available',
      componentStack: info.componentStack || 'No component stack available',
      erroredFile: erroredFile || 'Errored File is unknown',
    };

    FirebaseService.logError(errorDetails); // Log the error to Firestore

    // Update the state with the error and info for rendering
    this.setState({ error, info });
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      const firstLine = error.toString();
      const message = (
        <span>
          <strong>{t('Unexpected error')}</strong>
          {firstLine ? `: ${firstLine}` : ''}
        </span>
      );
      if (this.props.showMessage) {
        return (
          <ErrorMessageWithStackTrace
            subtitle={message}
            copyText={message}
            stackTrace={info ? info.componentStack : null}
          />
        );
      }
      return null;
    }
    return this.props.children;
  }
}
ErrorBoundary.propTypes = propTypes;
ErrorBoundary.defaultProps = defaultProps;
