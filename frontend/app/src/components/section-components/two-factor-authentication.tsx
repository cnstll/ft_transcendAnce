import { useState } from 'react';
import { User } from '../global-components/interface';

function Toggle({
  twoAuthenticationIsSet,
}: {
  twoAuthenticationIsSet: boolean | undefined;
}) {
  const [checked, setChecked] = useState(twoAuthenticationIsSet);

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden w-20">
      <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            readOnly
          />
          <div
            onClick={() => {
              setChecked(!checked);
            }}
            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full
            peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
          >
            {checked ? (
              <span className="ml-1 font-bold text-[9px] uppercase">ON</span>
            ) : (
              <span className="ml-6 font-bold text-[9px] uppercase text-black">
                OFF
              </span>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}

function TwoFactorAuthentication({ user }: { user: User }) {
  return (
    <div className="flex flex-row gap-4">
      <p>Two factor identification</p>
      <Toggle twoAuthenticationIsSet={user.twoFactorAuthenticationSet} />
    </div>
  );
}

export default TwoFactorAuthentication;
