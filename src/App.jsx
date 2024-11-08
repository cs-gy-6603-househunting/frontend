import { Provider } from 'react-redux'
import store from 'src/utils/redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import RouterConfig from 'src/navigation/RouterConfig'

import {
  Layout,
  Menu,
  Input,
  Button,
  Row,
  Col,
  Card,
  Form,
  Select,
  Typography,
  ConfigProvider,
} from 'antd'

const { Header, Content, Footer } = Layout
const { Title } = Typography
const { Option } = Select
const { Search } = Input

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '#ffc53d',
            borderRadius: 10,
          },
        }}
      >
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
            <BrowserRouter>
              <RouterConfig />
            </BrowserRouter>
          </Content>

          {/* Footer */}
          <Footer style={{ textAlign: 'center' }}>
            {`RoomScout © 2024. Made with ❤️ in Brooklyn.`}
          </Footer>
        </Layout>
      </ConfigProvider>
    </Provider>
  )
}

export default App
