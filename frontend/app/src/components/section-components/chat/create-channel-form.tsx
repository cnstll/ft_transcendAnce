import { Dispatch, useState } from 'react';
import { channelType } from '../../global-components/interface';
import useCreateChannel from '../../query-hooks/useCreateChannel';

interface CreateChannelFormProps {
  setShowForm: Dispatch<React.SetStateAction<boolean>>;
}

const defaultFormData = {
  name: '',
  type: channelType.Public,
  password: '',
};

function CreateChannelForm(props: CreateChannelFormProps) {
  const createChannelMutation = useCreateChannel();
  const [formData, setFormData] = useState(defaultFormData);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [inputStatus, setInputStatus] = useState<string>('empty');
  const { name, password } = formData;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputStatus('editing');
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  function checkFormData(formData: {
    name: string;
    type: channelType;
    password: string;
  }) {
    if (formData.name.length === 0) return 1;
    else if (
      formData.type === channelType.Protected &&
      formData.password.length === 0
    )
      return 2;
    return 0;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (checkFormData(formData) === 1) {
      setInputStatus('invalidName');
    } else if (checkFormData(formData) === 2) {
      setInputStatus('invalidPassword');
    } else {
      createChannelMutation.mutate(
        {
          name: formData.name,
          type: formData.type,
          passwordHash: formData.password,
        },
        {
          onSuccess() {
            props.setShowForm(false);
            setFormData(defaultFormData);
          },
          onError() {
            setInputStatus('invalidName');
            setInputStatus('invalidPassword');
          },
        },
      );
    }
  }

  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-[#222] bg-opacity-50">
        <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow text-black p-6">
            <h3 className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900 p-4 border-b">
              Create a new channel
            </h3>
            <form onSubmit={onSubmit}>
              <div id="form-channel-creation-name" className="form-group my-3 ">
                <label
                  htmlFor="ChannelName"
                  className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light my-3 font-bold"
                >
                  Enter a name:
                </label>
                <input
                  className={`form-control block w-full my-3 px-3 py-1.5 text-xs bg-gray-50 bg-clip-padding border-b-2 focus:ring-blue-500 focus:border-blue-500 focus:text-gray-500 ${
                    inputStatus == 'invalidName' ? 'border-red-500' : ''
                  }`}
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={onChange}
                  autoComplete="off"
                  placeholder="The name of your channel"
                />
              </div>
              <div
                id="form-channel-creation-type"
                className="form-group mb-3 mt-5"
              >
                <p className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light my-2 font-bold">
                  Select a type:
                </p>
                <div className="m-2">
                  <input
                    type="radio"
                    id="type"
                    name="type"
                    value={channelType.Public}
                    onChange={onChange}
                    onClick={() => setPasswordRequired(false)}
                    defaultChecked
                  />
                  <label
                    htmlFor="publicType"
                    className="text-gray-500 bg-white rounded-lg text-sm lg:text-base xl:text-base px-5"
                  >
                    Public - everyone can access freely
                  </label>
                </div>
                <div className="m-2">
                  <input
                    type="radio"
                    id="type"
                    name="type"
                    value={channelType.Private}
                    onChange={onChange}
                    onClick={() => setPasswordRequired(false)}
                  />
                  <label
                    htmlFor="privateType"
                    className="text-gray-500 bg-white rounded-lg text-sm px-5"
                  >
                    Private - only invited members can join
                  </label>
                </div>
                <div className="m-2">
                  <input
                    type="radio"
                    id="type"
                    name="type"
                    value={channelType.Protected}
                    onChange={onChange}
                    onClick={() => setPasswordRequired(true)}
                  />
                  <label
                    htmlFor="protectedType"
                    className="text-gray-500 bg-white rounded-lg text-sm px-5"
                  >
                    Protected - a password is required to join
                  </label>
                </div>
              </div>
              {passwordRequired && (
                <div id="form-channel-creation-password" className="form-group">
                  <label
                    htmlFor="ChannelPassword"
                    className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light my-3 font-bold"
                  >
                    Enter a password:
                  </label>
                  <input
                    className={`form-control block w-full my-3 px-3 py-1.5 text-xs bg-gray-50 bg-clip-padding border-b-2 focus:ring-blue-500 focus:border-blue-500 focus:text-gray-500 ${
                      inputStatus == 'invalidPassword' ? 'border-red-500' : ''
                    }`}
                    name="password"
                    id="password"
                    value={password}
                    onChange={onChange}
                    autoComplete="off"
                    placeholder="The password for your channel"
                  />
                </div>
              )}
              <div className="flex items-center py-2 space-x-2">
                <button
                  type="button"
                  onClick={() => props.setShowForm(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateChannelForm;