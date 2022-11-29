import { Dispatch, useEffect, useState } from 'react';
import JoinChannel from 'src/components/custom-hooks/emit-join-channel';
import { socket } from 'src/components/global-components/client-socket';
import { Channel } from 'src/components/global-components/interface';

interface PwdModalProps {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  channel: Channel;
}

function PasswordModal(props: PwdModalProps) {
  const [formData, setFormData] = useState('');
  const [inputStatus, setInputStatus] = useState<string>('empty');

  useEffect(() => {
    socket.on('joinRoomError', (channel: null | string) => {
      if (channel === 'InvalidPassword') {
        setInputStatus('invalidPassword');
      } else if (channel === 'PasswordRequired') {
        setInputStatus('passwordRequired');
      }
    });
    return () => {
      socket.off('joinRoomError');
    };
  }, [formData]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputStatus('editing');
    setFormData(e.target.value);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.channel.passwordHash = formData;
    JoinChannel(props.channel);
  }

  return (
    <>
      <div
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0
          h-modal h-full bg-[#222] bg-opacity-50 "
      >
        <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow text-black p-6">
            <h3
              className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900
                p-4 border-b"
            >
              Join {props.channel.name}
            </h3>
            <form onSubmit={onSubmit}>
              {/* Password section */}
              <div
                id="form-channel-check-password"
                className="form-group mt-4"
              >
                <label
                  htmlFor="ChannelPassword"
                  className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold"
                >
                  Enter the password:
                </label>
                <input
                  className={`form-control block w-full my-3 px-3 py-1.5 text-xs bg-gray-50 bg-clip-padding
                      border-b-2 focus:ring-blue-500 focus:border-blue-500 focus:text-gray-500 ${
                        inputStatus === 'invalidPassword' ||
                        inputStatus === 'passwordRequired'
                          ? 'border-red-500'
                          : ''
                      }`}
                  type="text"
                  name="password"
                  id="passwordHash"
                  value={formData}
                  onChange={onChange}
                  autoComplete="off"
                  placeholder={`Enter channel's password`}
                />
                {inputStatus === 'invalidPassword' && (
                  <p className="text-red-500 text-xs font-medium my-1">
                    Wrong password
                  </p>
                )}
                {inputStatus === 'passwordRequired' && (
                  <p className="text-red-500 text-xs font-medium my-1">
                    A password is required to enter this channel
                  </p>
                )}
              </div>
              {/* Buttons section */}
              <div className="flex items-center py-2 space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => props.setShowModal(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200
                  text-sm font-medium px-5 py-2.5 hover:text-gray-900"
                >
                  Quit
                </button>
                <button
                  type="submit"
                  className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PasswordModal;
