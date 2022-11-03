import { User } from '../global-components/interface';
import CenterBox from './center-box';
import MatchHistory from './match-history';

function MyMatchHistory({ user }: { user: User }) {
  return (
    <>
      <CenterBox>
        <div className="h-full overflow-y-auto">
          <div className="flex">
            <div className="flex-1">
              <h2 className="flex justify-center p-5 font-bold">
                MATCH HISTORY
              </h2>
              <MatchHistory imageCurrentPlayer={user.avatarImg} />
            </div>
          </div>
        </div>
      </CenterBox>
    </>
  );
}

export default MyMatchHistory;
