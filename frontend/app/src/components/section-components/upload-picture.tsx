// import { useState, useEffect } from 'react';
// import { UserData } from '../global-components/interface';
// import axios from 'axios';

function UploadPicture() {
  //   const [data, setData] = useState<UserData | null>(null);

  //   useEffect(() => {
  //     axios
  //       .put<UserData>('http://localhost:3000/user/update-avatarImg', {
  //         withCredentials: true,
  //       })
  //       .then((response) => {
  //         setData(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         // setLoggedin(false);
  //         setData(null);
  //       });
  //   }, []);

  return (
    <div className="flex justify-start hover:underline cursor-pointer">
      <p>Upload a picture</p>
    </div>
  );
}

export default UploadPicture;
