import { Dispatch, useEffect, useState } from 'react';
import { Channel, channelType } from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import {
  validateNameInput,
  isValidNameLength,
  isValidPassLength,
  validatePwdInput,
} from './form-input-validations';

interface EditChannelFormProps {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  currentChannel: Channel;
  setIsShown: Dispatch<React.SetStateAction<boolean>>;
}

function EditChannelForm(props: EditChannelFormProps) {
  const defaultFormData = {
    name: props.currentChannel.name,
    type: props.currentChannel.type,
    passwordHash: '',
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [inputStatus, setInputStatus] = useState<string>('empty');
  const { name, passwordHash } = formData;
  const specials = '!?@#$%^&*()+./\'${"}{-';

  useEffect(() => {
    socket.on('roomEdited', () => {
      props.setShowModal(false);
      props.setIsShown(false);
      setFormData(defaultFormData);
    });
    socket.on('editRoomFailed', (ret: null | string) => {
      if (ret === 'alreadyUsedname') {
        setInputStatus('invalidAlreadyUsedname');
      } else if (ret === 'passwordIncorrect') {
        setInputStatus('invalidWrongPassword');
      }
    });
    return () => {
      socket.off('editRoomFailed');
    };
  }, [formData]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    setInputStatus('editing');
    if (e.target.name === 'name' && !isValidNameLength(e.target.value))
      setInputStatus('invalidNameLength');
    else if (e.target.name === 'name' && !validateNameInput(e.target.value))
      setInputStatus('invalidName');
    else if (e.target.name === 'password' && !isValidPassLength(e.target.value))
      setInputStatus('invalidPasswordLength');
    else if (e.target.name === 'password' && !validatePwdInput(e.target.value))
      setInputStatus('invalidPassword');
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const channelId: string = props.currentChannel.id;
    if (!validateNameInput(formData.name)) {
      setInputStatus('invalidName');
    } else if (!isValidNameLength(formData.name)) {
      setInputStatus('invalidNameLength');
    } else if (
      formData.type === channelType.Protected &&
      formData.passwordHash.length > 0 &&
      !validatePwdInput(formData.passwordHash)
    ) {
      setInputStatus('invalidPassword');
    } else if (
      formData.type === channelType.Protected &&
      formData.passwordHash.length > 0 &&
      !isValidPassLength(formData.passwordHash)
    ) {
      setInputStatus('invalidPasswordLength');
    } else {
      socket.emit('editRoom', { channelId, editInfo: formData });
    }
  }

  return (
    <>
      <div
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0
          h-modal h-full bg-[#222] bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow text-black p-6">
            <h3
              className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900
                p-4 border-b"
            >
              Edit channel
            </h3>
            <form onSubmit={onSubmit}>
              <div id="form-channel-creation-name" className="form-group my-3 ">
                <label
                  htmlFor="ChannelName"
                  className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                  text-purple-light my-3 font-bold"
                >
                  Enter a name:
                </label>
                <p className="text-xs text-gray-400 my-1 font-light italic">
                  Name should be between 1 and 21 alphanumeric characters
                </p>
                <input
                  className={`form-control block w-full my-3 px-3 py-1.5 text-xs bg-gray-50 bg-clip-padding
                  border-b-2 focus:ring-blue-500 focus:border-blue-500 focus:text-gray-500 ${
                    inputStatus === 'invalidName' ||
                    inputStatus === 'invalidAlreadyUsedname' ||
                    inputStatus === 'invalidNameLength'
                      ? 'border-red-500'
                      : ''
                  }`}
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={onChange}
                  autoComplete="off"
                  placeholder={props.currentChannel.name}
                />
                {inputStatus === 'invalidAlreadyUsedname' && (
                  <p className="text-red-500 text-xs font-medium">
                    Name already taken
                  </p>
                )}
                {inputStatus === 'invalidName' && (
                  <p className="text-red-500 text-xs font-medium">
                    Invalid name format
                  </p>
                )}
                {inputStatus === 'invalidNameLength' && (
                  <p className="text-red-500 text-xs font-medium">
                    Name must be less than 22 characters
                  </p>
                )}
              </div>
              <div
                id="form-channel-creation-type"
                className="form-group mb-3 mt-5"
              >
                <p
                  className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                  text-purple-light my-2 font-bold"
                >
                  Select a type:
                </p>
                <div className="m-2">
                  <input
                    type="radio"
                    id="type"
                    name="type"
                    value={channelType.Public}
                    onChange={onChange}
                    defaultChecked={
                      props.currentChannel.type === channelType.Public
                    }
                  />
                  <label
                    htmlFor="publicType"
                    className="text-gray-500 bg-white rounded-lg text-sm px-5"
                  >
                    Public
                  </label>
                  {formData.type === channelType.Public && (
                    <p className="text-xs text-gray-400 my-1 font-light italic">
                      Everyone can access freely
                    </p>
                  )}
                </div>
                <div className="m-2">
                  <input
                    type="radio"
                    id="type"
                    name="type"
                    value={channelType.Private}
                    onChange={onChange}
                    defaultChecked={
                      props.currentChannel.type === channelType.Private
                    }
                  />
                  <label
                    htmlFor="privateType"
                    className="text-gray-500 bg-white rounded-lg text-sm px-5"
                  >
                    Private
                  </label>
                  {formData.type === channelType.Private && (
                    <p className="text-xs text-gray-400 my-1 font-light italic">
                      Only invited members can join
                    </p>
                  )}
                </div>
                <div className="m-2">
                  <input
                    type="radio"
                    id="type"
                    name="type"
                    value={channelType.Protected}
                    onChange={onChange}
                    defaultChecked={
                      props.currentChannel.type === channelType.Protected
                    }
                  />
                  <label
                    htmlFor="protectedType"
                    className="text-gray-500 bg-white rounded-lg text-sm px-5"
                  >
                    Protected
                  </label>
                  {formData.type === channelType.Protected && (
                    <p className="text-xs text-gray-400 my-1 font-light italic">
                      A password is required to join
                    </p>
                  )}
                </div>
              </div>
              {formData.type === channelType.Protected && (
                <div id="form-channel-creation-password" className="form-group">
                  <label
                    htmlFor="ChannelPassword"
                    className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold"
                  >
                    {props.currentChannel.type === channelType.Protected
                      ? 'Change the password: '
                      : 'Enter a new password: '}
                  </label>
                  <input
                    className={`form-control block w-full my-3 px-3 py-1.5 text-xs bg-gray-50 bg-clip-padding
                      border-b-2 focus:ring-blue-500 focus:border-blue-500 focus:text-gray-500 ${
                        inputStatus === 'invalidPassword' ||
                        inputStatus === 'invalidPasswordLength' ||
                        inputStatus === 'invalidWrongPassword'
                          ? 'border-red-500'
                          : ''
                      }`}
                    type="text"
                    name="password"
                    id="passwordHash"
                    value={passwordHash}
                    onChange={onChange}
                    autoComplete="off"
                    placeholder={`Between 1 and 32 alphanumeric and ${specials} characters`}
                  />
                  {inputStatus === 'invalidPassword' && (
                    <p className="text-red-500 text-xs font-medium">
                      Invalid password format
                    </p>
                  )}
                  {inputStatus === 'invalidPasswordLength' && (
                    <p className="text-red-500 text-xs font-medium">
                      Password must be less than 33 characters
                    </p>
                  )}
                  {inputStatus === 'invalidWrongPassword' && (
                    <p className="text-red-500 text-xs font-medium my-1">
                      Password is mandatory for protected channel
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-center py-2 space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => props.setShowModal(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200
                  text-sm font-medium px-5 py-2.5 hover:text-gray-900"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditChannelForm;
