import { Modal } from 'antd'

const Profile = ({ isProfileOpen, onClose }) => {
  return (
    <Modal
      title="Your Profile"
      centered={true}
      closable={true}
      open={isProfileOpen}
      onCancel={onClose}
      footer={null}
    >
      Hello
    </Modal>
  )
}

export default Profile
