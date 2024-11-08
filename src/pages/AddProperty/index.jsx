import { useState } from 'react'
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
  Flex,
  Modal,
  Alert,
  Progress,
  Steps,
} from 'antd'

import { PlusOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { Title } = Typography
const { Option } = Select
const { Search } = Input

const properties = [
  {
    id: 1,
    title: 'Cozy Apartment in City Center',
    price: 1200,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Modern Studio in Suburb',
    price: 900,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Spacious House Near Park',
    price: 1500,
    image: 'https://via.placeholder.com/300x200',
  },
]

const AddProperty = () => {
  const onSearch = (value) => console.log('Search value:', value)

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  const handleAddPropertyModalOpen = () => {
    setIsAddPropertyModalOpen(true)
  }

  const handleAddPropertyModalClose = () => {
    setIsAddPropertyModalOpen(false)
  }

  const addPropertyModalDescription = `We're here to make listing your property easy and flexible. You can complete the forms in any order you prefer. Each form covers a key section. Make sure to save a form when you've filled it. Once you've filled out and saved a form, you can always go back and edit it as long as the listing hasn't been submitted. After completing all sections, review your listing and submit it for verification. Once our team verifies it, your property will go live on the Listings page, and you'll be notified!`

  const [addPropertyProgressPercent, setAddPropertyProgressPercent] =
    useState(0)

  const [addProperyModalCurrentStep, setAddProperyModalCurrentStep] =
    useState(0)

  const steps = [
    {
      title: 'Property Overview',
      content: 'First-content',
    },
    {
      title: 'Amentities',
      content: 'Second-content',
    },
    {
      title: 'Media',
      content: 'Last-content',
    },
    {
      title: 'Final Details',
      content: 'Last-content',
    },
  ]

  const items = steps.map((item) => ({ key: item.title, title: item.title }))

  const onFinish = (values) => {
    console.log('Form values:', values)
  }

  return (
    <>
      <Flex gap="middle" justify="space-between"></Flex>
      <Modal
        title={`Adding your Property`}
        open={isAddPropertyModalOpen}
        onClose={handleAddPropertyModalClose}
        onCancel={handleAddPropertyModalClose}
        width={'150vh'}
        footer={null}
      >
        <br />
        <Alert message={addPropertyModalDescription} type="warning" />
        <br />

        <Steps
          current={addProperyModalCurrentStep}
          items={items}
          progressDot
          style={{ marginTop: '5vh', marginBottom: '2vh' }}
        />

        <div
          style={{
            padding: '20px',
            minHeight: '45vh',
          }}
        >
          <Form layout="vertical" onFinish={onFinish} variant="filled">
            {/* Title Field */}
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Title" />
            </Form.Item>

            {/* Location Fields */}
            <Form.Item
              label="Location"
              rules={[
                {
                  required: true,
                  message: 'Please provide complete location details',
                },
              ]}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="streetAddress" noStyle>
                    <Input placeholder="Street Address" />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="city" noStyle>
                    <Input placeholder="City" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="state" noStyle>
                    <Input placeholder="State" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="zipCode" noStyle>
                    <Input placeholder="Zip Code" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* Property Type and Room Information */}
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: 'Please select a property type',
                    },
                  ]}
                >
                  <Select placeholder="Select type of property">
                    <Option value="apartment">Apartment</Option>
                    <Option value="house">House</Option>
                    <Option value="condo">Condo</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Number of Bedrooms"
                  name="bedrooms"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the number of bedrooms',
                    },
                  ]}
                >
                  <Select placeholder="Select number of bedrooms">
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Number of Bathrooms"
                  name="bathrooms"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the number of bathrooms',
                    },
                  ]}
                >
                  <Select placeholder="Select number of bathrooms">
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Buttons */}
            <Form.Item>
              <Row justify="space-between">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: '#000', color: '#fff' }}
                  >
                    Save as draft
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="default"
                    style={{ backgroundColor: '#ff6b6b', color: '#fff' }}
                  >
                    Main menu
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Card
        title="Your Properties"
        extra={
          <Button
            type="primary"
            onClick={handleAddPropertyModalOpen}
            icon={<PlusOutlined />}
          >{`Add a Property`}</Button>
        }
      ></Card>
    </>
  )
}

export default AddProperty
