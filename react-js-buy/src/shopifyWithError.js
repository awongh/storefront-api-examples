import React from 'react';

class ShopifyErrorBoundary extends React.Component {
  constructor(props) {
    console.log("construct error THINGY");
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log("CATCH");
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    console.log("RENDER");
    if (this.state.error) {
      // Fallback UI if an error occurs
      return (
        <div>
          <h2>{"Oh-no! Something went wrong"}</h2>
          <p className="red">
            {this.state.error && this.state.error.toString()}
          </p>
          <div>{"Component Stack Error Details: "}</div>
          <p className="red">{this.state.errorInfo.componentStack}</p>
        </div>
      );
    }else{
      // component normally just renders children
      return this.props.children;
    }
  }
}

export default ShopifyErrorBoundary;
