'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { ApolloProvider } from '@apollo/client';
import client from '../app/lib/apolloClient';

const Layout = ({ children }) => {
  return (
    <div>
      <ApolloProvider client={client}>
        {/* <Sidebar /> */}
        <div>{children}</div>
      </ApolloProvider>
    </div>
  );
};

export default Layout;
