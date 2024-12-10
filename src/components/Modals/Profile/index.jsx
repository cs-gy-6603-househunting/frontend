import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import { UserRoles } from 'src/utils/enum'
import { Alert } from 'antd'
import { LesseProfileInfoMessage } from './constants'
import './index.less'
import LesseeView from './LesseeView'

const Profile = ({ isProfileOpen, onClose }) => {
  const user = useSelector((state) => state.auth.user)

  const getLessorView = () => {
    return (
      <>
        <Alert description={LesseProfileInfoMessage} type="info" />
      </>
    )
  }

  return (
    <Modal
      title="Your Profile"
      centered={true}
      closable={true}
      open={isProfileOpen}
      onCancel={onClose}
      footer={null}
      width={'150vh'}
      maskClosable={false}
      destroyOnClose={true}
    >
      {user.role === UserRoles.Lessee ? <LesseeView /> : getLessorView()}
    </Modal>
  )
}

export default Profile
