import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';

const generateQRCode = () =>
  axios
    .get<string>(`http://${process.env.REACT_APP_BACKEND_URL}/2fa/generate-qr-code`, {
      withCredentials: true,
    })
    .then((response) => response.data);

function useQRCode(): UseQueryResult<string> {
  return useQuery('QRCode', generateQRCode);
}

export default useQRCode;
