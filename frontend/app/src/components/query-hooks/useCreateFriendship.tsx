import axios from "axios";
import { useQueryClient, useMutation } from 'react-query'

const postFriendRequest = (user: { target: string | undefined }) => axios.post<null>('http://localhost:3000/user/request-friend', user, { withCredentials: true }).then((res) => res.data)

export default function useCreateFriendship() {
  const queryClient = useQueryClient();
  return useMutation((user: { target: string | undefined }) => postFriendRequest(user), {
    onSuccess: () => queryClient.refetchQueries(['targetInfo']),
  });
}

