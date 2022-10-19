import React from 'react';
import styled from 'styled-components';
import {Helmet} from 'react-helmet';
import 'antd/dist/antd.less';
import './Layout.css';

function Layout({children, location}) {

  return (
    <>
      <Helmet>
        <title></title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Helmet>
        <div style={{flex: 1}}>{children}</div>
    </>
  );
}

const Wrapper = styled.div`
  --contentMaxWidth: 1920px;
  --contentMinHeight: 600px;
  --topNavBarHeight: 64px;
  --basePadding: 15px 20px;
  --primaryColor: #0eb407;
  --sectionPadding: 50px 100px;
  --sectionMobilePadding: 20px;

  min-height: 100vh;
  display: flex;
  flex-direction: column;

  
`;

export default Layout;
