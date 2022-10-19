import React from 'react';

const AppContext = React.createContext({});

class AppContextProdvider extends React.Component {
  constructor (props) {
    super(props);

    const actions = {
      toggle: () => {
        this.setState(prev => ({ theme: prev.theme === 'light'? 'dark ': 'light' }))
      },
      setLoading: value => this.setState({ loading: value })
    };

    this.state = {
      theme: 'light',
      loading: false,
      actions
    };

  }

  render() {
    return (
      <AppContext.Provider value={this.state} {...this.props}>{this.props.children}</AppContext.Provider>
    )
  }
}


export default AppContextProdvider;
export { AppContext }