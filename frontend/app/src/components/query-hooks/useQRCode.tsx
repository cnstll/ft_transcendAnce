import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl } from '../global-components/interface';

const generateQRCode = () =>
  axios
    .get<string>(`http://${apiUrl}/2fa/generate-qr-code`, {
      withCredentials: true,
    })
    .then((response) => response.data);

function useQRCode(): UseQueryResult<string> {
  return useQuery('QRCode', generateQRCode);
}

export default useQRCode;
