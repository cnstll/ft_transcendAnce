import {
  faUserGroup,
  faUserPlus,
  faCheck,
  faX,
  faHourglass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from './tooltip';
import useCreateFriendship from '../query-hooks/useCreateFriendship';
import useUpdateFriendship from '../query-hooks/useUpdateFriendship';

interface FriendStatusProps {
  status: string | null | undefined;
  nickname: string;
}

function FriendStatus(props: FriendStatusProps) {
  const friendRequest = useCreateFriendship();
  const friendUpdate = useUpdateFriendship();

  return (
    <>
      <p>
        {props.status === null && (
          <button
            onClick={() => friendRequest.mutate({ target: props.nickname })}
          >
            {' '}
            <Tooltip
              description="Send friend request"
              element={<FontAwesomeIcon icon={faUserPlus} />}
            />{' '}
          </button>
        )}{' '}
      </p>
      <p>
        {props.status === 'PENDING' && (
          <button
            onClick={() =>
              friendUpdate.mutate({ target: props.nickname, friends: true })
            }
          >
            <a data-bs-toggle="tooltip" title="Accept friend request">
              {' '}
              <FontAwesomeIcon icon={faUserGroup} />{' '}
              <FontAwesomeIcon icon={faCheck} />
            </a>{' '}
          </button>
        )}{' '}
      </p>
      <p>
        {props.status === 'ACCEPTED' && (
          <button
            onClick={() =>
              friendUpdate.mutate({ target: props.nickname, friends: false })
            }
          >
            <a data-bs-toggle="tooltip" title="Unfriend">
              {' '}
              <FontAwesomeIcon icon={faUserGroup} />{' '}
              <FontAwesomeIcon icon={faX} />
            </a>{' '}
          </button>
        )}{' '}
      </p>
      <p>
        {props.status === 'REQUESTED' && (
          <button
            onClick={() =>
              friendUpdate.mutate({ target: props.nickname, friends: false })
            }
          >
            <a data-bs-toggle="tooltip" title="Cancel request">
              {' '}
              <FontAwesomeIcon icon={faHourglass} />{' '}
              <FontAwesomeIcon icon={faX} />
            </a>{' '}
          </button>
        )}{' '}
      </p>
    </>
  );
}

export default FriendStatus;
