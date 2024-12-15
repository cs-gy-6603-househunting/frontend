import React, { useState, useEffect } from 'react'
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Carousel,
  Button,
  Empty,
  List,
  Spin,
  Pagination,
  Modal,
  Checkbox,
  Table,
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  HeartFilled,
  LoadingOutlined,
} from '@ant-design/icons'
import propertiesService from 'src/apis/propertiesService'
import { App } from 'antd'
import { useSelector } from 'react-redux'
import { ScrollablePageContent } from 'src/global-styles/utils'

const { Header, Content } = Layout
const { Title, Text } = Typography

const Wishlist = () => {
  const [properties, setProperties] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState([])
  const [isComparisonVisible, setIsComparisonVisible] = useState(false)

  const user = useSelector((state) => state.auth.user)
  const { notification } = App.useApp()

  const fetchWishlistedProperties = async (requestObj) => {
    setIsLoading(true)
    try {
      const response = await propertiesService.getWishlistedProperties(
        requestObj
      )
      if (response.success) {
        setProperties(response.data.properties)
        setTotalCount(response.data.total_count)
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch wishlisted properties',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlistedProperties({ page: 1, per_page: pageSize })
  }, [])

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setCurrentPage(1)
      fetchWishlistedProperties({ page: 1, per_page: newPageSize })
    } else {
      setCurrentPage(page)
      fetchWishlistedProperties({ page, per_page: pageSize })
    }
  }

  const removeFromWishlist = async (property) => {
    togglePropertyComparison(property)
    const requestObj = {
      property_id: property.id,
      lessee_id: user.userId,
    }
    const response = await propertiesService.addToWishlist(requestObj)
    if (response.success) {
      notification.success({
        message: 'Success',
        description: 'Property removed from wishlist',
      })
      if (properties.length === 1 && currentPage !== 1) {
        setCurrentPage(currentPage - 1)
        fetchWishlistedProperties({ page: currentPage - 1, per_page: pageSize })
        return
      }
      fetchWishlistedProperties({ page: currentPage, per_page: pageSize })
    } else {
      notification.error({
        message: 'Error',
        description: 'Failed to remove property from wishlist',
      })
    }
  }

  const togglePropertyComparison = (property) => {
    if (selectedForComparison.some((p) => p.id === property.id)) {
      setSelectedForComparison((prev) =>
        prev.filter((p) => p.id !== property.id)
      )
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison((prev) => [...prev, property])
    } else {
      notification.info({
        message: 'Info',
        description: 'You can only compare up to 3 properties at a time',
      })
    }
  }

  const showComparison = () => {
    if (selectedForComparison.length >= 2) {
      setIsComparisonVisible(true)
    } else {
      notification.info({
        message: 'Info',
        description: 'Please select atleast 2 properties to compare',
      })
    }
  }

  const closeComparison = () => {
    setIsComparisonVisible(false)
  }

  return (
    <Layout style={{ background: 'transparent', minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <Title level={3}>My Wishlist</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
          {properties.length === 0 && !isLoading ? (
            <Empty
              description="No properties in your wishlist"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
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
                          {property.images.length > 0 ? (
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
                            ))
                          ) : (
                            <div>
                              <img
                                src="https://via.placeholder.com/300x200"
                                alt="Placeholder"
                                style={{
                                  width: '100%',
                                  height: 200,
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          )}
                        </Carousel>
                      </Col>
                      <Col span={16}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Title level={4}>${property.rent}/month</Title>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Checkbox
                              checked={selectedForComparison.some(
                                (p) => p.id === property.id
                              )}
                              onChange={() =>
                                togglePropertyComparison(property)
                              }
                            />
                            {selectedForComparison.some(
                              (p) => p.id === property.id
                            ) && (
                              <Button
                                type="primary"
                                style={{
                                  marginLeft: '10px',
                                }}
                                onClick={() => showComparison()} // Example: Could show comparison directly
                              >
                                Compare Now
                              </Button>
                            )}
                            <Button
                              type="text"
                              icon={
                                <HeartFilled
                                  style={{
                                    fontSize: '20px',
                                    color: '#ff4d4f',
                                  }}
                                />
                              }
                              onClick={() => removeFromWishlist(property)}
                            />
                          </div>
                        </div>
                        <Text strong>{property.title}</Text>
                        <br />
                        <Text type="secondary">
                          {`📍 ${property.address.street_address}, ${property.address.city}, ${property.address.state}, ${property.address.zip_code}`}
                        </Text>
                        <br />
                        <Text>
                          {`🛏️ ${property.details.bedrooms} bd • 🛁 ${property.details.bathrooms} ba • 🏠 ${property.details.property_type}`}
                        </Text>
                        <br />
                        <Text>{property.details.description}</Text>
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
                showSizeChanger
              />
            </Col>
          </Row>
        )}
      </Content>

      <Modal
        open={isComparisonVisible}
        title="Compare Properties"
        footer={null}
        centered
        onCancel={closeComparison}
        width={1000}
      >
        <ScrollablePageContent>
          <Table
            dataSource={[
              {
                key: '1',
                detail: 'Rent',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    `$${property.rent}/month`,
                  ])
                ),
              },
              {
                key: '2',
                detail: 'Address',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    `${property.address.street_address}, ${property.address.city}, ${property.address.state} ${property.address.zip_code}`,
                  ])
                ),
              },
              {
                key: '3',
                detail: 'Bedrooms',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.details.bedrooms,
                  ])
                ),
              },
              {
                key: '4',
                detail: 'Bathrooms',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.details.bathrooms,
                  ])
                ),
              },
              {
                key: '5',
                detail: 'Property Type',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.details.property_type,
                  ])
                ),
              },
              {
                key: '6',
                detail: 'Amenities',
                children: Object.keys(selectedForComparison[0]?.amenities || {}) // Get keys from the first property's amenities
                  .filter((amenity) => amenity !== 'property_id') // Exclude 'property_id'
                  .map((amenity, index) => ({
                    key: `6.${index + 1}`, // Unique key for each amenity
                    detail: amenity
                      .replace(/_/g, ' ') // Replace underscores with spaces
                      .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize words
                    ...Object.fromEntries(
                      selectedForComparison.map((property, idx) => [
                        `property${idx + 1}`, // Dynamically create property columns
                        property.amenities[amenity] ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        ),
                      ])
                    ),
                  })),
              },
              {
                key: '7',
                detail: 'Points of Interest (POIs)',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.pois
                      .map((poi) => `${poi.poi_name} (${poi.distance})`)
                      .slice(0, 2)
                      .join(', '),
                  ])
                ),
              },
              {
                key: '8',
                detail: 'Available Since',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    new Date(property.available_since).toLocaleDateString(),
                  ])
                ),
              },
              {
                key: '9',
                detail: 'Additional Notes',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.additional_notes,
                  ])
                ),
              },
            ]}
            columns={[
              {
                title: 'Details',
                dataIndex: 'detail',
                key: 'detail',
                fixed: 'left',
                render: (text) => (
                  <span style={{ fontWeight: 600 }}>{text}</span>
                ),
                width: 150,
              },
              ...selectedForComparison.map((property, index) => ({
                title: property.title,
                dataIndex: `property${index + 1}`,
                key: `property${index + 1}`,
                width: 50, // Restrict property column width
              })),
            ]}
            bordered
            pagination={false}
          />
        </ScrollablePageContent>
      </Modal>
    </Layout>
  )
}

export default Wishlist
