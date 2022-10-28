import { useQueryClient } from 'react-query';
// import { useState } from 'react';
import { User } from '../global-components/interface';
import { generate2fa, toggle2fa } from '../query-hooks/set2fa';

interface TwofaProps {
  twoFactorAuthenticationIsSet: boolean;
  twoFactorAuthenticationSecret: string;
}

function Generate2fa() {
  const queryClient = useQueryClient();
  const generate2faMutation = generate2fa();

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
    <div
      onClick={on2faActivation}
      className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full
        peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
        after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
    >
      {/* <span className="ml-6 font-bold text-[9px] text-black">OFF</span> */}
    </div>
  );
}

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
      {/* <span className="ml-6 font-bold text-[9px] text-black">OFF</span> */}
    </div>
  );
}

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
            <Generate2fa />
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
    </div>
  );
}

export default TwoFactorAuthentication;