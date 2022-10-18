import React, { Dispatch, SetStateAction } from 'react';

interface IProfileDataCtx {
  userNickname: string;
  setUserNickname: Dispatch<SetStateAction<string>>;
}
// set the defaults
const ProfileDataCtx = React.createContext<IProfileDataCtx>({
  userNickname: 'Anonymous',
  setUserNickname: () => {},
});

export default ProfileDataCtx;
