import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log error if needed
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <a href="/" className="text-blue-600 underline">Go Home</a>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
