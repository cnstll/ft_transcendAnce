import axios from "axios";
import { useQueryClient, useMutation } from 'react-query'

const putFriendUpdate = (user: { target: string | undefined, friends: boolean }) => axios.put<null>(`http://${process.env.REACT_APP_BACKEND_URL}/user/update-friendship`, user, { withCredentials: true }).then((res) => res.data)

export default function useUpdateFriendship() {
  const queryClient = useQueryClient();
  return useMutation((user: { target: string | undefined, friends: boolean }) => putFriendUpdate(user), {
    onSuccess: () => queryClient.refetchQueries(['targetInfo']),
  });
}

