import { Layout, Menu } from 'antd'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import { routeLists } from 'src/navigation/routeLists'

const { Header, Content, Footer } = Layout

const LayoutContainer = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header with Navigation */}
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div
          className="logo"
          style={{
            float: 'left',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '20px',
          }}
        >
          {`RoomScout`}
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="properties">Properties</Menu.Item>
          <Menu.Item key="about">About Us</Menu.Item>
          <Menu.Item key="contact">Contact</Menu.Item>
        </Menu>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '50px 50px', marginTop: 64 }}>
        <Routes>
          {routeLists.map((o) => {
            return <Route key={o.key} path={o.path} Component={o.component} />
          })}
        </Routes>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center' }}>
        {`RoomScout © 2024. Made with ❤️ in Brooklyn.`}
      </Footer>
    </Layout>
  )
}

export default LayoutContainer
