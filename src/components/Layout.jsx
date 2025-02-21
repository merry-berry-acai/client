import React from 'react';
import { Container} from '@mui/material';
import Header from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
        {children}
      <Footer />
    </>
  );
};

export default Layout;
