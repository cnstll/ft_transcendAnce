import React, { ChangeEvent, Dispatch, useState } from 'react';
import { useQueryClient } from 'react-query';
import setAvatarImg from '../query-hooks/setAvatarImg';
import { UseOutsideDivClick } from '../customed-hooks/use-outside-click';
import { User } from '../global-components/interface';

interface AvatarImgFormProps {
  setShowForm: Dispatch<React.SetStateAction<boolean>>;
  selectedFile: File | undefined;
}

function UploadPictureForm({ setShowForm, selectedFile }: AvatarImgFormProps) {
  const queryClient = useQueryClient();
  const avatarImgMutation = setAvatarImg();

  function onFileChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    let fileName = '';
    if ('files' in event.target) selectedFile = event.target.files?.[0];
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      fileName =
        'http://localhost:3000/user/avatar/' +
        selectedFile.name.replace(/\s/g, '');
    }
    avatarImgMutation.mutate(formData, {
      onSuccess: ({ status }) => {
        if (status === 201 || status === 200) {
          setShowForm(false);
          queryClient.setQueryData<User>('userData', (oldData): User => {
            return {
              ...oldData!,
              avatarImg: fileName,
            };
          });
        }
      },
    });
  }

  return (
    <div className="absolute block p-3 mr-6 rounded-lg shadow-lg bg-purple-light w-72">
      <form>
        <input
          className="form-control w-full py-1.5 bg-clip-padding
          text-sm sm:text-sm md:text-lg"
          type="file"
          id="avatarImgInput"
          accept="image/png, image/jpeg, image/webp"
          onChange={onFileChange}
        ></input>
      </form>
    </div>
  );
}


function UploadPicture() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedFile] = useState<File | undefined>();

  function showUploadPictureForm() {
    setShowForm(!showForm);
  }

  function ClickOutsideHandler() {
    setShowForm(false);
  }

  const ref = UseOutsideDivClick(ClickOutsideHandler);

  return (
    <>
      <div ref={ref}>
        <div className="flex justify-start hover:underline cursor-pointer">
          <p onClick={showUploadPictureForm}>Upload a picture</p>
        </div>
        <div>
          {showForm && (
            <UploadPictureForm
              setShowForm={setShowForm}
              selectedFile={selectedFile}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default UploadPicture;
