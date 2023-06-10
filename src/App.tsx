import React, {  useEffect, useState } from 'react';
import './App.css'
import { connectWallet, getAccount } from "./utils/wallet";
import { Layout, Menu, theme } from 'antd';

// Custom components
import ClaimCoupon from './components/ClaimCoupon/ClaimCoupon'
import CreateCoupon from './components/CreateCoupon/CreateCoupon';
import TrackCoupons from './components/TrackCoupons/TrackCoupons';
import LoginPage from './components/LoginPage/LoginPage';

const { Header, Content, Footer, Sider } = Layout;


const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Declaration of User enum
  enum User {
    Admin,
    Client,
    NonLoggedin
  }

  // User type (state)
  // Changes depending on current hash of active account
  const [userType, setUserType] = useState(User.Admin)

  // Wallet Account Replace userType with this
  const [account, setAccount] = useState("");

  useEffect(() => {
    (async () => {
      // Get the active account
      const account = await getAccount();
      setAccount(account);
    })();
  }, []);
  
  // Connect Wallet
  const onConnectWallet = async () => {
    // get address of the account
    await connectWallet();
    const account = await getAccount();
    setAccount(account);
  };


  // Menu items for ADMIN
  const adminMenuItems = [
    {
      key: 'create',
      label: "Create Coupon",
    },
    {
      key: 'track',
      label: "Track Coupons",
    }
  ];

  // Menu items for CLIENT
  const clientMenuItems = [
    {
      key: 'claim',
      label: "Claim Coupons",
    }
  ];

  // Menu items (state)
  // Changes depending on user type
  const [menuItems, setMenuItems] = useState(adminMenuItems)
  
  // Page (state)
  // Changes depending on selected menu item
  const [page, setPage] = useState(menuItems[0].key);

  // Function for displaying page content
  // Returns the component corresponding to the page content upon function call
  const displayContent = (page: string) => {
    if (userType === User.Client) {
      switch (page) {
        case 'claim':
          return(<ClaimCoupon />);
      }
    } else if (userType === User.Admin){
  
      switch (page) {
        case 'create':
          return (<CreateCoupon />);
        case 'track':
          return (<TrackCoupons />);
      }
    } else{
        return (<LoginPage/ >);
    }
  };

  // UI section
  return (
    <Layout hasSider>
      
      {userType !== User.NonLoggedin ? (
          <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo" >
            <img src={require("./assets/couffer-logo-white.png")} alt="Couffer Logo" style={{width: "150px", marginLeft: "auto", marginRight: "auto", display: "block"}}/>
          </div>
          <Menu
            theme="dark"
            className='nav-menu'
            mode="inline"
            defaultSelectedKeys={[menuItems[0].key]}
            items={menuItems}
            onClick={(e) => setPage(e.key)}
          />
        </Sider>
        ) : (
          null // or <></> if you prefer
        )}
      
      {userType !== User.NonLoggedin ? (
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer}}>
          <div className='right-align'>
          <button onClick={onConnectWallet} className="connect-wallet-btn">
              {account ? account : "Connect Wallet" }
          </button>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            {displayContent(page)}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>JJAKK ©2023</Footer>
      </Layout>
      ):(
        <Layout className="site-layout" style={{ marginLeft: 0 }}>
        <Header style={{ padding: 0, background: colorBgContainer}}>
        <div className="logo" >
            <img src={require("./assets/couffer-logo.png")} alt="Couffer Logo" style={{width: "150px", marginLeft: "auto", marginRight: "auto", display: "block"}}/>
          </div>
        </Header>
        
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            {displayContent(page)}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>JJAKK ©2023</Footer>
      </Layout>
      )}

      
    </Layout>
  );
};

export default App;

