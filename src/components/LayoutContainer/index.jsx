import { Layout, Menu } from 'antd'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { routeLists } from 'src/navigation/routeLists'
import { UserOutlined } from '@ant-design/icons'
import { ProfileContainer, ProfileInfoContainer } from './styles'
import { Popover } from 'antd'
import { useSelector } from 'react-redux'
import { CTAS } from 'src/global-styles/utils'
import { useAuth } from '../AuthProvider'
import { clearAuthOnLogout } from 'src/utils/storage'
import Profile from '../Modals/Profile'
import { useState } from 'react'

const { Header, Content, Footer } = Layout

const LayoutContainer = () => {
  const navigate = useNavigate()

  const [isProfileOpen, setProfileOpen] = useState(false)
  const [isPopOverMenuOpen, setPopOverOpen] = useState(false)

  const user = useSelector((state) => state.auth.user)

  const { logout } = useAuth()

  const handleMenuClick = (e) => {
    console.log(e)
    navigate(`/${e.key}`)
  }

  const handleSignOut = () => {
    clearAuthOnLogout()
    logout()
  }

  const profileMenu = (
    <Menu mode="vertical" selectable={false}>
      <Menu.Item
        key="profile"
        onClick={() => {
          setProfileOpen(true)
          setPopOverOpen(false)
        }}
      >
        Profile
      </Menu.Item>
      <Menu.Item key="signout" onClick={handleSignOut}>
        Sign Out
      </Menu.Item>
    </Menu>
  )

  const onProfileClose = () => {
    setProfileOpen(false)
  }

  const handlePopOverOpenChange = (newOpen) => {
    setPopOverOpen(newOpen)
  }

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
        <ProfileContainer>
          <Popover
            trigger={'click'}
            content={profileMenu}
            open={isPopOverMenuOpen}
            onOpenChange={handlePopOverOpenChange}
          >
            <ProfileInfoContainer>
              <UserOutlined style={CTAS} />
              {`${user.email}`}
            </ProfileInfoContainer>
          </Popover>
        </ProfileContainer>
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

      <Profile isProfileOpen={isProfileOpen} onClose={onProfileClose} />
    </Layout>
  )
}

export default LayoutContainer
