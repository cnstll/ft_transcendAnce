import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { Channel } from "../global-components/interface";

const fetchAllChannels = () =>
  axios
    .get<Channel[]>('http://localhost:3000/channels/', {
      withCredentials: true,
  }).then((res) => res.data);

function useChannelsList(): UseQueryResult<Channel[]> {
  return useQuery('channelsList', fetchAllChannels);
}

export default useChannelsList;
