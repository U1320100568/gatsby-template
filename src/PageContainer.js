import './index.css';
import React from 'react';
import AppContextProdvider from './AppContext';
import Layout from './Components/Layout';

const qs = require('query-string');

export function PageContainer(props) {

  return <Layout {...props}>{props.children}</Layout>;
}


export function AppRoot (props){
  return <AppContextProdvider>{props.children}</AppContextProdvider>
}

