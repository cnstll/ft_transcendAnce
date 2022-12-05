import React, { ChangeEvent, Dispatch, useState } from 'react';
import { useQueryClient } from 'react-query';
import setAvatarImg from '../../query-hooks/setAvatarImg';
import { UseOutsideDivClick } from '../../custom-hooks/use-outside-click';
import { apiUrl, User } from '../../global-components/interface';
import { toast } from 'react-toastify';

interface AvatarImgFormProps {
  setShowForm: Dispatch<React.SetStateAction<boolean>>;
  selectedFile: File | undefined;
}

function UploadPictureForm({ setShowForm, selectedFile }: AvatarImgFormProps) {
  const queryClient = useQueryClient();
  const avatarImgMutation = setAvatarImg();
  const customToastId = "custom-toast-cant-upload-picture";

  function onFileChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    let fileName = '';
    if ('files' in event.target) selectedFile = event.target.files?.[0];
      const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      fileName =
        `${apiUrl}/user/avatar/` +
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
      onError: () => {
        toast.error("Your image doesn't meet requirements", {
          toastId: customToastId,
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  }

  return (
    <>
      <div
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0
          h-modal h-full bg-[#222] bg-opacity-50 "
      >
        <div className="relative p-4 w-full max-w-sm h-full md:h-auto left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow text-black p-6">
            <h3
              className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900
                p-4 border-b"
            >
              Your avatar
            </h3>
            <form>
            <div id="form-avatar" className="form-group mt-4">
                <label
                  className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold"
                  htmlFor="changePicture"
                >
                  Upload a new picture
                </label>
                <input
                  className="form-control text-gray-500 bg-white hover:bg-gray-100 rounded-lg
                  text-xs px-2 py-2.5 hover:text-gray-900"
                  type="file"
                  id="avatarImgInput"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={onFileChange}
                ></input>
              </div>
              <div className="flex items-center py-2 space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200
                  text-sm font-medium px-5 py-2.5 hover:text-gray-900"
                >
                  Quit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
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
          <p className="static" onClick={showUploadPictureForm}>
            Upload a picture
          </p>
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
