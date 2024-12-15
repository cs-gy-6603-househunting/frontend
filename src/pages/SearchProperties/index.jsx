import React, { useState, useEffect } from 'react'
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Carousel,
  Typography,
  Divider,
  Tag,
  List,
  Empty,
  Spin,
  Pagination,
} from 'antd'
import {
  SearchOutlined,
  HomeOutlined,
  DollarOutlined,
  BankOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons'
import propertiesService from 'src/apis/propertiesService'
import { range } from 'src/utils/utils'
import { App } from 'antd'
import { message } from 'antd'
import { useSelector } from 'react-redux'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const PropertySearch = () => {
  const [properties, setProperties] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form] = Form.useForm()
  const user = useSelector((state) => state.auth.user)
  const { notification } = App.useApp()

  const fetchProperties = async (values) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await propertiesService.searchProperties(values)

      if (response.success) {
        let filteredProperties = response.data.properties

        if (values.min_rent) {
          filteredProperties = filteredProperties.filter(
            (property) => property.details.rent >= values.min_rent
          )
        }

        if (values.max_rent) {
          filteredProperties = filteredProperties.filter(
            (property) => property.details.rent <= values.max_rent
          )
        }

        setProperties(filteredProperties)
        setTotalCount(response.data.total_count)
      } else {
        setError(response.message)
      }
    } catch (err) {
      //   setError('An error occurred while fetching properties.');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const values = form.getFieldsValue()
    fetchProperties({ ...values, page: 1, per_page: pageSize })
  }, [])

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setCurrentPage(1)
      const values = form.getFieldsValue()
      fetchProperties({ ...values, page: 1, per_page: newPageSize })
    } else {
      setCurrentPage(page)
      const values = form.getFieldsValue()
      fetchProperties({ ...values, page, per_page: pageSize })
    }
  }

  const onFinish = (values) => {
    setCurrentPage(1)
    fetchProperties({ ...values, page: 1, per_page: pageSize })
  }

  const toggleWishlist = async (property) => {
    const requestObj = {
      property_id: property.id,
      lessee_id: user.userId,
    }
    const response = await propertiesService.addToWishlist(requestObj)
    if (response.success) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setProperties((prevProperties) =>
        prevProperties.map((p) =>
          p.id === property.id ? { ...p, isInWishlist: !p.isInWishlist } : p
        )
      )
    } else {
      notification.error({
        message: 'Error',
        description: response.data.message,
      })
    }
  }

  return (
    <Layout
      style={{
        background: 'transparent',
        minHeight: '100vh',
      }}
    >
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <Title level={3}>Property Search</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Card>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[
                    { required: true, message: 'Please enter a location' },
                  ]}
                  initialValue={'10001'}
                >
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Enter location"
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="radius"
                  label="Radius (km)"
                  rules={[{ required: true, message: 'Please enter a radius' }]}
                  initialValue={5}
                >
                  <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="min_rent" label="Min Rent">
                  <InputNumber
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="max_rent" label="Max Rent">
                  <InputNumber
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="bedrooms" label="Bedrooms">
                  <Select placeholder="Select bedrooms" allowClear>
                    {range(5).map((num) => (
                      <Option key={num} value={num}>
                        {num}+ bd
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="bathrooms" label="Bathrooms">
                  <Select placeholder="Select bathrooms" allowClear>
                    {range(5).map((num) => (
                      <Option key={num} value={num}>
                        {num}+ ba
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="property_type" label="Property Type">
                  <Select placeholder="Select property type" allowClear>
                    <Option value="apartment">Apartment</Option>
                    <Option value="house">House</Option>
                    <Option value="condo">Condo</Option>
                    <Option value="studio">Studio</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sort_by" label="Sort By">
                  <Select placeholder="Sort by">
                    <Option value="rent_asc">Rent: Low to High</Option>
                    <Option value="rent_desc">Rent: High to Low</Option>
                    <Option value="date_desc">Newest First</Option>
                    <Option value="date_asc">Oldest First</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                Search Properties
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Divider />

        <Spin spinning={isLoading}>
          {error && <Text type="danger">{error}</Text>}
          {properties.length === 0 && !isLoading ? (
            <Empty description="No properties found" />
          ) : (
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={properties}
              renderItem={(property) => (
                <List.Item>
                  <Card
                    hoverable
                    style={{
                      width: '100%',
                      marginBottom: 16,
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Carousel autoplay>
                          {property.images.length !== 0 &&
                            property.images.map((image) => (
                              <div key={image.id}>
                                <img
                                  src={image.url}
                                  alt={property.title}
                                  style={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                  }}
                                />
                              </div>
                            ))}
                        </Carousel>
                      </Col>
                      <Col span={16}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Title level={4}>
                            ${property.details.rent}/month
                          </Title>
                          <Button
                            type="text"
                            icon={
                              property.isInWishlist ? (
                                <HeartFilled
                                  style={{
                                    fontSize: '20px',
                                    color: '#ff4d4f', // Base red color
                                    filter:
                                      'drop-shadow(0 0 2px rgba(255,77,79,0.3))', // Adds a subtle glow
                                    background:
                                      'linear-gradient(45deg, #ff4d4f, #ff7875)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }}
                                />
                              ) : (
                                <HeartOutlined
                                  style={{
                                    fontSize: '20px',
                                    color: '#d9d9d9', // Light gray for non-wishlist items
                                  }}
                                />
                              )
                            }
                            onClick={() => toggleWishlist(property)}
                          />
                        </div>
                        <Text strong>{property.title}</Text>
                        <br />
                        <Text type="secondary">
                          {property.address.street_address},{' '}
                          {property.address.city}, {property.address.state}{' '}
                          {property.address.zip_code}
                        </Text>
                        <br />
                        <Text>
                          {`🛏️ ${property.details.bedrooms} bd • 🛁 ${property.details.bathrooms} ba • 🏠 ${property.details.property_type}`}
                        </Text>
                        <br />
                        <Text>{property.details.description}</Text>
                        <br />
                        <Tag color="blue">
                          {property.distance.toFixed(2)} km away
                        </Tag>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Spin>

        {properties.length > 0 && (
          <Row justify="end">
            <Col>
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={pageSize}
                onChange={(page, pageSize) => handlePageChange(page, pageSize)}
                pageSizeOptions={[10, 30, 50, 100]}
                showSizeChanger={true}
              />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  )
}

export default PropertySearch
