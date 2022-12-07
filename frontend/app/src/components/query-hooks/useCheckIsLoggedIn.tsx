import axios, { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, User } from '../global-components/interface';

const fetchUser = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: Error | AxiosError) => {
      return error;
    },
  );
  return axios
    .get<User>(`${apiUrl}/user/get-front-user-info`, {
      withCredentials: true,
    })
    .then((response) => response.data)
    .catch();
};

function useCheckIsLoggedIn(): UseQueryResult<User> {
  return useQuery('checkIsLoggedIn', fetchUser);
}

export default useCheckIsLoggedIn;
