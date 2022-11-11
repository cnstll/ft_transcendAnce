import axios from "axios";
import { useQueryClient, useMutation } from 'react-query'
import { apiUrl } from "../global-components/interface";

const putFriendUpdate = (user: { target: string | undefined, friends: boolean }) => axios.put<null>(`http://${apiUrl}/user/update-friendship`, user, { withCredentials: true }).then((res) => res.data)

export default function useUpdateFriendship() {
  const queryClient = useQueryClient();
  return useMutation((user: { target: string | undefined, friends: boolean }) => putFriendUpdate(user), {
    onSuccess: () => queryClient.refetchQueries(['targetInfo']),
  });
}

