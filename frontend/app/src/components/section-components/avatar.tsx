import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import NickNameForm from './nickname-form';
import { UseOutsideDivClick } from '../customed-hooks/use-outside-click';

interface AvatarProps {
  userName: string;
}

function Avatar(props: AvatarProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [nickName, setNickName] = useState<string>(props.userName);

  function showEditNameForm() {
    setShowForm(!showForm);
  }

  function ClickOutsideHandler() {
    setShowForm(false);
  }

  const ref = UseOutsideDivClick(ClickOutsideHandler);
  return (
    <div>
      <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
        <p> {nickName}</p>
        <div ref={ref}>
          <button onClick={showEditNameForm}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <div>
            {showForm && (
              <NickNameForm
                setShowForm={setShowForm}
                setNickName={setNickName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Avatar;
