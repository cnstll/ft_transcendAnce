import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';

const generateQRCode = () =>
  axios
    .get<string>('http://localhost:3000/2fa/generate-qr-code', {
      withCredentials: true,
    })
    .then((response) => response.data);

function useQRCode(): UseQueryResult<string> {
  return useQuery('QRCode', generateQRCode);
}

export default useQRCode;
