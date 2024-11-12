import { Layout, Menu, Dropdown, Button } from 'antd'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { routeLists } from 'src/navigation/routeLists'
import { UserOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout

const LayoutContainer = () => {
  const navigate = useNavigate()

  const handleMenuClick = (e) => {
    console.log(e)
    navigate(`/${e.key}`)
  }

  const handleSignOut = () => {
    // Add sign-out logic here
    console.log('Signed out')
  }

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <div>
          <strong>Name:</strong> John Doe
        </div>
        <div>
          <strong>Email:</strong> john.doe@example.com
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="signout" onClick={handleSignOut}>
        Sign Out
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header with Navigation */}
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          className="logo"
          style={{
            float: 'left',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '20px',
            marginRight: '5vh',
          }}
        >
          {`RoomScout`}
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          onClick={handleMenuClick}
          style={{ flex: 1 }}
        >
          <Menu.Item key="home">{`Home`}</Menu.Item>
          <Menu.Item key="properties">{`Manage Property`}</Menu.Item>
          <Menu.Item key="about">{`About Us`}</Menu.Item>
          <Menu.Item key="contact">{`Contact`}</Menu.Item>
        </Menu>
        <Dropdown menu={profileMenu} trigger={['click']}>
          <Button type="text" icon={<UserOutlined />} style={{ color: '#fff' }}>
            {`Profile`}
          </Button>
        </Dropdown>
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
