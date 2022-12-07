import axios from "axios";
import { useQueryClient, useMutation } from 'react-query'
import { apiUrl } from "../global-components/interface";

const postFriendRequest = (user: { target: string | undefined, friends: boolean }) => axios.post<null>(`${apiUrl}/user/request-friend`, user, { withCredentials: true }).then((res) => res.data)

export default function useCreateFriendship() {
  const queryClient = useQueryClient();
  return useMutation((user: { target: string | undefined, friends: boolean }) => postFriendRequest(user), {
    onSuccess: () => queryClient.refetchQueries(['targetInfo']),
  });
}

