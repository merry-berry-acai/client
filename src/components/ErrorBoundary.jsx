import React, { Component } from 'react';
import Layout from './Layout';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <h2>Something went wrong.</h2>
          <p>Try refreshing the page or come back later.</p>
        </Layout>)
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
