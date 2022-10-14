import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import NickNameForm from './nickname-form';

interface AvatarProps {
  userName: string;
}

function Avatar(props: AvatarProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  function showEditNameForm() {
    setShowForm(!showForm);
  }
  const [nickName, setNickName] = useState<string>(props.userName);

  return (
    <div>
      <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
        <p> {nickName}</p>
        <button onClick={showEditNameForm}>
          <FontAwesomeIcon icon={faPencil} />
        </button>
        {showForm && (
          <NickNameForm setShowForm={setShowForm} setNickName={setNickName} />
        )}
      </div>
    </div>
  );
}

export default Avatar;
