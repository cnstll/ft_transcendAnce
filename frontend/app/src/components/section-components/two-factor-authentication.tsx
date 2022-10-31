// import axios from 'axios';
import { FormEvent, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { User } from '../global-components/interface';
import { generate2fa, toggle2fa, validate2faCode } from '../query-hooks/set2fa';
import useQRCode from '../query-hooks/useQRCode';

interface TwofaProps {
  twoFactorAuthenticationIsSet: boolean;
  twoFactorAuthenticationSecret: string;
}

/**
 *
 * This function generates the 2FA Secret and displays the toggle button if 2fa is set or not
 *
 */

function Generate2fa({
  twoAuthenticationIsSet,
}: {
  twoAuthenticationIsSet: boolean;
}) {
  const queryClient = useQueryClient();
  const generate2faMutation = generate2fa();

  /* Generate 2FA Secret */

  function on2faActivation() {
    generate2faMutation.mutate(
      {},
      {
        onSuccess: ({ status }) => {
          if (status === 201 || status === 200) {
            queryClient.setQueryData<User>('userData', (oldData): User => {
              return {
                ...oldData!,
                twoFactorAuthenticationSet: true,
              };
            });
          }
        },
      },
    );
  }

  return (
    <div>
      <div
        onClick={on2faActivation}
        className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full
        peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
        after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
      >
        {twoAuthenticationIsSet ? (
          <span className="ml-1 font-bold text-[9px]">ON</span>
        ) : (
          <span className="ml-6 font-bold text-[9px] text-black">OFF</span>
        )}
      </div>
    </div>
  );
}

/**
 *
 * This function displays the toggle button if 2fa is set or not
 *
 */

function Toggle2fa({
  twoAuthenticationIsSet,
}: {
  twoAuthenticationIsSet: boolean;
}) {
  const queryClient = useQueryClient();
  const toggle2faMutation = toggle2fa();

  function on2faChange() {
    toggle2faMutation.mutate(!twoAuthenticationIsSet, {
      onSuccess: ({ status }) => {
        if (status === 201 || status === 200) {
          queryClient.setQueryData<User>('userData', (oldData): User => {
            return {
              ...oldData!,
              twoFactorAuthenticationSet: !twoAuthenticationIsSet,
            };
          });
        }
      },
    });
  }

  return (
    <div
      onClick={on2faChange}
      className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full
          peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
    >
      {twoAuthenticationIsSet ? (
        <span className="ml-1 font-bold text-[9px]">ON</span>
      ) : (
        <span className="ml-6 font-bold text-[9px] text-black">OFF</span>
      )}
    </div>
  );
}

/**
 *
 * This function displays the 2FA Modal if 2FA is activated. It will show the QR Code and ask for the authentication code
 *
 */

function TwoFaModal({
  twoAuthenticationIsSet,
}: {
  twoAuthenticationIsSet: boolean;
}) {
  const getQRCode = useQRCode();
  const qrCode = getQRCode.data;
  const toggle2faMutation = toggle2fa();
  const validate2faMutation = validate2faCode();
  const queryClient = useQueryClient();
  const verficationCodeRef = useRef<HTMLInputElement>(null);
  const [validCode, setValidCode] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(twoAuthenticationIsSet);

  function closeModal() {
    toggle2faMutation.mutate(!twoAuthenticationIsSet, {
      onSuccess: ({ status }) => {
        if (status === 201 || status === 200) {
          queryClient.setQueryData<User>('userData', (oldData): User => {
            return {
              ...oldData!,
              twoFactorAuthenticationSet: !twoAuthenticationIsSet,
            };
          });
        }
      },
    });
  }

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = verficationCodeRef.current
      ? verficationCodeRef.current.value
      : '';
    validate2faMutation.mutate(input, {
      onSuccess: () => {
        setValidCode(true);
        setShowModal(false);
      },
      onError: () => {
        setValidCode(false);
      },
    });
  }

  return (
    <>
      {getQRCode.isSuccess && showModal && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-[#222] bg-opacity-50">
          <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
            <div className="relative bg-white rounded-lg shadow text-black p-6">
              <h3 className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900 p-4 border-b">
                Two-Factor Authentication (2FA)
              </h3>
              <h4 className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light font-medium border-b sm:my-2 md:my-2 mt-6 mb-4">
                Configuring Google Authenticator or Authy
              </h4>
              <div className="space-y-1 lg:text-sm md:text-sm sm:text-xs text-xs">
                <li>
                  Install Google Authenticator (IOS - Android) or Authy (IOS -
                  Android).
                </li>
                <li>In the authenticator app, select "+" icon.</li>
                <li>
                  Select "Scan a barcode (or QR code)" and use the phone's
                  camera to scan this barcode.
                </li>
              </div>
              <h4 className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light font-medium border-b sm:my-2 md:my-2 mb-2 mt-4">
                Scan QR Code
              </h4>
              <div className="flex justify-center">
                <img
                  className="block lg:w-64 md:w-40 sm:w-32 w-24 lg:h-64 md:h-40 sm:h-32 h-24 object-contain"
                  src={qrCode}
                />
              </div>
              <div>
                <h4 className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light font-medium border-b my-2">
                  Verify Code
                </h4>
                <h5 className=" lg:text-sm md:text-xs sm:text-xs text-xs py-2">
                  For changing the setting, please verify the authentication
                  code:
                </h5>
              </div>
              <form onSubmit={onSubmitHandler}>
                <input
                  className={`bg-gray-50 border md:text-xs sm:text-xs text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2 my-4 sm:my-2 md:my-2
                  ${
                    validCode
                      ? 'border-gray-300 text-gray-900'
                      : ' border-red-500 text-red-500'
                  }`}
                  type="text"
                  name="code"
                  placeholder="Authentication Code"
                  ref={verficationCodeRef}
                />
                <div className=" items-center py-2 space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Verify & Activate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 *
 * This function is used to display the toggle button and call the generate or toggle2fa function depending if the user's 2fa secret is generated
 *
 */

function Toggle({ twoFa }: { twoFa: TwofaProps }) {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden w-20">
      <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={twoFa.twoFactorAuthenticationIsSet}
            readOnly
          />
          {!twoFa.twoFactorAuthenticationSecret ? (
            <Generate2fa
              twoAuthenticationIsSet={twoFa.twoFactorAuthenticationIsSet}
            />
          ) : (
            <Toggle2fa
              twoAuthenticationIsSet={twoFa.twoFactorAuthenticationIsSet}
            />
          )}
        </label>
      </div>
    </div>
  );
}

function TwoFactorAuthentication({ user }: { user: User }) {
  const twoFa: TwofaProps = {
    twoFactorAuthenticationIsSet: user.twoFactorAuthenticationSet,
    twoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
  };

  return (
    <div className="flex flex-row gap-4">
      <p>Two factor identification</p>
      <Toggle twoFa={twoFa} />
      {user.twoFactorAuthenticationSet && (
        <TwoFaModal twoAuthenticationIsSet={user.twoFactorAuthenticationSet} />
      )}
    </div>
  );
}

export default TwoFactorAuthentication;
