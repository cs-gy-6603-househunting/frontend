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
  Checkbox,
  Upload,
  DatePicker,
  Empty,
  notification,
  InputNumber,
  List,
  Tag,
  Carousel,
  Divider,
  Tooltip,
} from 'antd'

import Icon, {
  PlusOutlined,
  PictureOutlined,
  LoadingOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  SyncOutlined 
} from '@ant-design/icons'

import { Formik, Field, ErrorMessage, useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import propertiesService from 'src/apis/propertiesService'
import { CTAS, ScrollablePageContent } from 'src/global-styles/utils'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { App } from 'antd'
import { Spin } from 'antd'
import '../../index.css';

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography
const { Option } = Select
const { Search, TextArea } = Input
const { Dragger } = Upload

export const STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED = 0;
export const STATUS_VERIFICATION_PROPERTY_SUBMITTED = 1;
export const STATUS_VERIFICATION_PROPERTY_DENIED = 2;
export const STATUS_VERIFICATION_PROPERTY_VERIFIED = 3;

const AddProperty = () => {
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  const addPropertyModalDescription = `We're here to make listing your property easy and flexible. You can complete the forms in any order you prefer. Each form covers a key section. Make sure to save a form when you've filled it. Once you've filled out and saved a form, you can always go back and edit it as long as the listing hasn't been submitted. After completing all sections, review your listing and submit it for verification. Once our team verifies it, your property will go live on the Listings page, and you'll be notified!`

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

  const amenities_list = [
    {
      label: 'Air Conditioning',
      value: 'air_conditioning',
    },
    {
      label: 'Parking',
      value: 'parking',
    },
    {
      label: 'Dishwasher',
      value: 'dishwasher',
    },
    {
      label: 'Heating',
      value: 'heating',
    },
    {
      label: 'Gym Access',
      value: 'gym',
    },
    {
      label: 'Refrigerator',
      value: 'refrigerator',
    },
    {
      label: 'Laundry',
      value: 'laundry',
    },
    {
      label: 'Swimming Pool',
      value: 'swimming_pool',
    },
    {
      label: 'Microwave',
      value: 'microwave',
    },
  ]

  const property_types = [
    {
      label: 'Apartment',
      value: 'apartment',
    },
    {
      label: 'House',
      value: 'house',
    },
    {
      label: 'Condo',
      value: 'condo',
    },
  ]

  const bedroom_list = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },

    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
  ]

  const bathroom_list = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },

    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
  ]

  const [form] = useForm()
  const [fileList, setFileList] = useState([])
  const { notification } = App.useApp()
  const [isLoading, setLoading] = useState(false)
  const [propertyListing, setPropertyListing] = useState([])
  const [initialValues, setInitialValues] = useState(null)
  const [isEdit, setIdEdit] = useState(false)

  const getStatusTag = (status) => {
    const tagStyle = {
      fontSize: '14px', // Increase font size
      fontWeight: 'bold', // Optional for better visibility
      padding: '5px 10px', // Adjust padding for better appearance
      borderRadius: '5px', // Rounded corners for a modern look
    };
    switch (status) {
      case STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED:
        return (
          <Tag color="orange" icon={<ExclamationCircleOutlined />} style={tagStyle}>
            Not Submitted for Verification
          </Tag>
        );
      case STATUS_VERIFICATION_PROPERTY_SUBMITTED:
        return (
          <Tag color="blue" icon={<SyncOutlined />} style={tagStyle}>
            Submitted for Verification
          </Tag>
        );
      case STATUS_VERIFICATION_PROPERTY_DENIED:
        return (
          <Tag color="red" icon={<CloseCircleOutlined />} style={tagStyle}>
            Verification Denied
          </Tag>
        );
      case STATUS_VERIFICATION_PROPERTY_VERIFIED:
        return (
          <Tag color="green" icon={<CheckCircleOutlined />} style={tagStyle}>
            Verified
          </Tag>
        );
      default:
        return null;
    }
  };

  const handleAddPropertyModalOpen = (isEdit, initialValues) => {
    setIdEdit(isEdit)
    form.resetFields()

    if (isEdit && initialValues) {
      const existingFileList = initialValues.images.map((item) => {
        return {
          uid: item.id,
          name: item.file_name,
          url: item.url,
          status: 'done',
        }
      })
      setFileList(existingFileList)
    } else {
      setFileList([])
    }
    setIsAddPropertyModalOpen(true)
  }

  const handleAddPropertyModalClose = () => {
    setAddProperyModalCurrentStep(0)
    setIsAddPropertyModalOpen(false)
  }

  useEffect(() => {
    console.log('a')
    getPropertyListings()
  }, [])

  useEffect(() => {
    console.log(fileList)
  }, [fileList])

  const getPropertyListings = async () => {
    const res = await propertiesService.getPropertyListings()
    if (res.data) {
      setPropertyListing(res.data.properties)
    }
  }

  const handleRemove = (file) => {
    setFileList((prevList) =>
      prevList.map((item) =>
        item.uid === file.uid
          ? { ...item, status: item.url ? 'removed' : 'ignored' }
          : item
      )
    )

    return false
  }

  const visibleFileList = fileList.filter((file) => file.status !== 'removed')

  const handleUploadChange = ({ file, fileList: newFileList }) => {
    // Ensure only new files from the device are added to the list
    const updatedList = newFileList.map((f) => {
      if (!f.url) {
        // Files from the device will not have a URL; mark them as new
        return { ...f, status: 'new' }
      }
      return f
    })
    setFileList(updatedList)
  }

  const onFinish = () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue(true)
      const requestObj = {
        ...formValues,
        available_since: formValues.available_since.format('YYYY-MM-DD'),
      }
      const filesToDelete = fileList.filter((file) => file.status === 'removed')
      const filesToUpload = fileList.filter((file) => file.status === 'new')

      if (isEdit) {
        setLoading(true)
        const res = await propertiesService.updatePropertyApi({
          ...requestObj,
          property_id: initialValues.id,
        })
        if (res.success) {
          const propertyId = initialValues.id
          const formData = new FormData()
          formData.append('property_id', propertyId)
          filesToUpload.forEach((file) => {
            formData.append('new_images', file.originFileObj)
          })
          formData.append(
            'deleted_images',
            JSON.stringify(filesToDelete.map((file) => file.uid))
          )
          // const uploadRes = await propertiesService.propertyUploadImage(
          //   formData
          // )
          // if (uploadRes.success) {
            notification.success({
              message: 'Property Updated',
              description: 'Successfully updated property to listing',
            })
            form.resetFields()
            handleAddPropertyModalClose()
            setAddProperyModalCurrentStep(0)
          // }
        }
        setLoading(false)
      } else {
        setLoading(true)
        const res = await propertiesService.listPropertyApi(requestObj)
        if (res.success) {
          const propertyId = res.data.property_id
          const formData = new FormData()
          formData.append('property_id', propertyId)
          filesToUpload.forEach((file) => {
            formData.append('new_images', file.originFileObj)
          })
          formData.append(
            'deleted_images',
            JSON.stringify(filesToDelete.map((file) => file.url))
          )
          // const uploadRes = await propertiesService.propertyUploadImage(
          //   formData
          // )
          // if (uploadRes.success) {
            notification.success({
              message: 'Property Added',
              description: 'Successfully added property to listing',
            })
            form.resetFields()
            handleAddPropertyModalClose()
            setAddProperyModalCurrentStep(0)
          // }
        }
        setLoading(false)
      }
      getPropertyListings()
    })
  }

  const validateFields = () => {
    form.validateFields().then(async () => {
      setAddProperyModalCurrentStep(addProperyModalCurrentStep + 1)
    })
  }

  const handleSubmitForVerification = async (propertyId) => {
    try {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }

      console.log('Submitting property for verification:', propertyId);
      const response = await propertiesService.submitPropertyForVerification(propertyId);
      
      if (!response) {
        throw new Error('No response received from server');
      }

      if (response.success) {
        notification.success({
          message: 'Success',
          description: response.message,
        });
        // Refresh property list or perform other UI updates
      } else {
        notification.error({
          message: 'Error',
          description: response.error || 'Failed to submit property for verification',
        });
      }
    } catch (error) {
      console.error('Verification submission error:', error);
      notification.error({
        message: 'Error',
        description: error.message || 'An unexpected error occurred during verification submission',
      });
    }
};

  return (
    <div > 
    <>
      <Flex gap="middle" justify="space-between"></Flex>
      <Modal
        title={isEdit ? 'Modify your property' : `Adding your Property`}
        open={isAddPropertyModalOpen}
        onClose={handleAddPropertyModalClose}
        onCancel={handleAddPropertyModalClose}
        width={'150vh'}
        destroyOnClose={true}
        centered
        footer={[
          addProperyModalCurrentStep !== 0 ? (
            <Button
              key="back"
              onClick={() => {
                setAddProperyModalCurrentStep(addProperyModalCurrentStep - 1)
              }}
              htmlType="submit"
              className="button"
            >{`Previous`}</Button>
          ) : (
            <></>
          ),
          addProperyModalCurrentStep === 3 ? (
            <Button key="next" type="primary" onClick={onFinish} htmlType="submit"
            className="button">
              {isEdit ? 'Update' : `Save`}
            </Button>
          ) : (
            <Button
              key="next"
              htmlType="submit"
              className="button"
              type="primary"
              onClick={() => {
                validateFields()
              }}
            >
              {`Next`}
            </Button>
          ),
        ]}
      >
        <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
          <ScrollablePageContent>
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
              <Form layout="vertical" variant="filled" form={form}>
                {addProperyModalCurrentStep === 0 && (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Title"
                          name="title"
                          rules={[
                            { required: true, message: 'Please enter a title' },
                          ]}
                          initialValue={isEdit ? initialValues.title : ''}
                        >
                          <Input
                            placeholder="Title"
                            disabled={
                              isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Rent"
                          name="rent"
                          rules={[
                            { required: true, message: 'Please enter a rent' },
                          ]}
                          initialValue={isEdit ? initialValues.rent : ''}
                        >
                          {/* make this input a numerical field */}
                          <InputNumber
                            placeholder="Rent"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Location Fields */}
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="street_address"
                          label="Location"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter a street address',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.street_address : ''
                          }
                          disabled={
                            isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                          }
                        >
                          <Input 
                            placeholder="Street Address" 
                            disabled={
                              isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name="city"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter city',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.city : ''
                          }
                        >
                          <Input placeholder="City" disabled={
                            isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                          }/>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="state"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter state',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.state : ''
                          }
                        >
                          <Input placeholder="State" disabled={
                            isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                          }/>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="zip_code"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter a zipcode',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.zip_code : ''
                          }
                        >
                          <Input placeholder="Zip Code" 
                          disabled={
                            isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                          }/>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Property Type and Room Information */}
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label="Property Type"
                          name="property_type"
                          rules={[
                            {
                              required: true,
                              message: 'Please select a property type',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.details.property_type : ''
                          }
                        >
                          <Select placeholder="Select type of property"
                          disabled={
                            isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                          }>
                            {property_types.map((property_type) => (
                              <Option
                                key={property_type?.value}
                                value={property_type?.value}
                              >
                                {property_type?.label}
                              </Option>
                            ))}
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
                          initialValue={
                            isEdit ? initialValues.details.bedrooms : ''
                          }
                        >
                          <Select placeholder="Select number of bedrooms" 
                          disabled={
                              isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                            }>
                            {bedroom_list.map((bedroom) => (
                              <Option
                                key={bedroom?.value}
                                value={bedroom?.value}
                              >
                                {bedroom?.label}
                              </Option>
                            ))}
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
                          initialValue={
                            isEdit ? initialValues.details.bathrooms : ''
                          }
                        >
                          <Select 
                            placeholder="Select number of bathrooms"
                            disabled={
                              isEdit && initialValues.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                            }
                          >
                            {bathroom_list.map((bathroom) => (
                              <Option
                                key={bathroom?.value}
                                value={bathroom?.value}
                              >
                                {bathroom?.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
                {addProperyModalCurrentStep === 1 && (
                  <>
                    <Form.Item
                      label="Property Description"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter a description',
                        },
                      ]}
                      initialValue={
                        isEdit ? initialValues.details.description : ''
                      }
                    >
                      <TextArea
                        rows={4}
                        placeholder="Describe the property, unique features, nearby attractions, etc."
                        maxLength={255}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Amenities"
                      name="amenities"
                      initialValue={
                        isEdit
                          ? Object.entries(initialValues.amenities)
                              .filter(
                                ([key, value]) =>
                                  key !== 'property_id' && value === true
                              )
                              .map(([key]) => key)
                          : []
                      }
                    >
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row gutter={16}>
                          {amenities_list.map((amenity) => (
                            <Col span={8}>
                              <Checkbox
                                key={amenity?.value}
                                value={amenity?.value}
                              >
                                {amenity?.label}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </>
                )}
                {addProperyModalCurrentStep === 2 && (
                  <>
                    <Form.Item label="Media Upload" name="media">
                      <Dragger
                        fileList={visibleFileList}
                        onRemove={handleRemove}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                      >
                        <p className="ant-upload-drag-icon">
                          <PictureOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                          Support for a single or bulk upload. Strictly
                          prohibited from uploading company data or other banned
                          files.
                        </p>
                      </Dragger>
                    </Form.Item>
                  </>
                )}
                {addProperyModalCurrentStep === 3 && (
                  <>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          label="Available Since"
                          name="available_since"
                          rules={[
                            { required: true, message: 'Please enter a date' },
                          ]}
                          initialValue={
                            isEdit ? dayjs(initialValues.available_since) : ''
                          }
                        >
                          <DatePicker
                            style={{ minWidth: '80%' }}
                            minDate={dayjs()}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Is Guarantor Required?"
                          name="guarantor_required"
                          rules={[
                            {
                              required: true,
                              message: 'Please provide a response',
                            },
                          ]}
                          initialValue={
                            isEdit
                              ? initialValues.details.guarantor_required
                              : null
                          }
                        >
                          <Select
                            style={{ minWidth: '80%' }}
                            options={[
                              {
                                value: true,
                                label: 'Yes',
                              },
                              {
                                value: false,
                                label: 'No',
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          label="Any terms/conditions/additional notes?"
                          name="miscellaneous_text"
                          initialValue={
                            isEdit ? initialValues.addtional_notes : ''
                          }
                        >
                          <TextArea rows={4} placeholder="" maxLength={255} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            </div>
          </ScrollablePageContent>
        </Spin>
      </Modal>

        <div width="1780px"
        > 

        <Row justify="space-between">
          <Col>
            <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
              Your Properties
            </Title>
          </Col>
          <Col>
          <Button
              onClick={() => handleAddPropertyModalOpen(false)}
              icon={<PlusOutlined />}
              type="primary" 
              htmlType="submit"
              className="button"
          >
              {`Add a Property`}
          </Button>

          </Col>
        </Row>
        </div>
        <Divider></Divider>

      {/* <Layout marginTop="10px"> */}
      <Layout
      style={{
        background: 'transparent', // Make Layout background transparent
        minHeight: '100vh', // Ensure it covers the entire viewport height
      }}
    >
        
        {propertyListing.length === 0 && (
          <Empty description="No properties found" />
        )}
        {propertyListing.length !== 0 &&
        propertyListing.map((item) => {
        return (
          <>
            <Row gutter={[20, 20]}>
            <Col span={30}>
              <List grid={{ gutter: 20, column: 1 }}>
                <List.Item>
                  <div class="glass" width="1780px">
                  {/* <Card
                    hoverable
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                      padding: "5px",
                      width: "1740px",
                    }}
                  > */}
                    <div style={{ flex: 1, padding: "5px", display: "flex", width: "100%" }}>
                      {/* Property Image */}
                      {/* <div style={{ padding: "0", margin: "0" }}> */}
                      {/* Property Image Carousel */}
                      <Carousel
                        arrows={true}
                        style={{
                          width: "450px",
                          height: "300px",
                          padding: "0"
                        }}
                      >
                        {item.images && item.images.length > 0 ? (
                          item.images.map((image, index) => (
                            <div key={index}>
                              <img
                                src={image.url}
                                alt={`Property image ${index + 1}`}
                                style={{
                                  width: "450px",
                                  height: "300px",
                                  objectFit: "cover", // Ensures the image scales nicely
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
                                width: "450px",
                                height: "300px",
                              }}
                            />
                          </div>
                        )}
                      </Carousel>
                      {/* Property Details */}
                      <div style={{ flex: 1, marginLeft: "20px" }} >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {/* Rent and Title */}
                        <Text strong style={{ fontSize: "24px" }}>
                          ${item.rent}/month 
                        </Text>

                        <div style={{ display: "flex", justifyContent: "space-between" }}></div>

                        {getStatusTag(item.status_verification)}
                        
                        </div>
                        

                        {/* Address */}
                        <div style={{ marginTop: "10px" }}>
                          <Text style={{ fontSize: "15px", display: "block" }}>
                            {item.title} 📍 {item.address.street_address}, {item.address.city}, {item.address.state}, {item.address.zip_code}
                          </Text>
                        </div>

                        {/* Bedrooms and Bathrooms */}
                        <div style={{ marginTop: "10px" }}>
                          <Text style={{ fontSize: "15px", display: "block" }}>
                            🛏️ {item.details.bedrooms} bd • 🛁 {item.details.bathrooms} ba
                          </Text>
                        </div>

                        {/* Description */}
                        <div style={{ marginTop: "10px" }}>
                          <Text style={{ fontSize: "15px" }}>
                            {item.details.description || "No Description Available"}
                          </Text>
                        </div>

                        {/* Action Buttons */}
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <Tooltip
                            title={
                              item.status_verification === STATUS_VERIFICATION_PROPERTY_SUBMITTED
                                ? 'You cannot edit this property because it is submitted for verification.'
                                : item.status_verification === STATUS_VERIFICATION_PROPERTY_VERIFIED
                                ? 'You can only edit select fields of a verified property.'
                                : ''
                            }
                          >
                          <Button 
                            icon={<EditOutlined />} 
                            disabled={item.status_verification === STATUS_VERIFICATION_PROPERTY_SUBMITTED}
                            onClick={() => {
                              setInitialValues(item);
                              handleAddPropertyModalOpen(true, item);
                            }}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleRemoveClick(item)}
                            style={{
                              borderColor: "#ff4d4f",
                            }}
                          >
                            Remove
                          </Button>
                          {item.status_verification === STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED && (
                            <Button                              
                              onClick={() => handleSubmitForVerification(item.id)}
                            >
                              Submit for Verification
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  {/* </Card> */}
                  </div>
                </List.Item>
              </List>
            </Col>
          </Row>
          </>
        );
      })
    }
      </Layout>
    </>
    </div>
  )
}

export default AddProperty
