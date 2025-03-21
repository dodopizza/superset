/* eslint-disable no-underscore-dangle */
// DODO was here
import { Component, ErrorInfo, ReactNode } from 'react';
import { t } from '@superset-ui/core';
import ErrorMessageWithStackTrace from 'src/components/ErrorMessage/ErrorMessageWithStackTrace';
import { FirebaseService } from 'src/firebase'; // DODO added 47015293

export interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  showMessage?: boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
  info: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static defaultProps: Partial<ErrorBoundaryProps> = {
    showMessage: true,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);

    // DODO added start 47015293
    // @ts-ignore
    const erroredFile = this.props?.children?._source
      ? // @ts-ignore
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
    // DODO added stop 47015293

    this.setState({ error, info });
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      const firstLine = error.toString();
      const messageString = `${t('Unexpected error')}${
        firstLine ? `: ${firstLine}` : ''
      }`;
      const messageElement = (
        <span>
          <strong>{t('Unexpected error')}</strong>
          {firstLine ? `: ${firstLine}` : ''}
        </span>
      );

      if (this.props.showMessage) {
        return (
          <ErrorMessageWithStackTrace
            subtitle={messageElement}
            copyText={messageString}
            stackTrace={info?.componentStack}
          />
        );
      }
      return null;
    }
    return this.props.children;
  }
}
