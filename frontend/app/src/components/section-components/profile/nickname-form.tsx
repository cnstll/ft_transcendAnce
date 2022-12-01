import { Dispatch, FormEvent, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { User } from '../../global-components/interface';
import setUserNickname from '../../query-hooks/setUserNickname';

function NickNameForm({
  setShowForm,
}: {
  setShowForm: Dispatch<React.SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const nicknameMutation = setUserNickname();

  const nickNameRef = useRef<HTMLInputElement>(null);
  const [inputStatus, setInputStatus] = useState<string>('empty');

  function validateNameInput(input: string): boolean {
    const regex = /^[\w\d]+$/;
    const ret = input.length !== 0 && input.length <= 15 && regex.test(input);
    return ret;
  }

  function onChangeHandler() {
    setInputStatus('editing');
    const input = nickNameRef.current ? nickNameRef.current.value : '';
    if (input.length > 15)
      setInputStatus('invalidLength');
    else if (!validateNameInput(input))
      setInputStatus('invalidName');
  }

  // When pressing enter the new nickname is submitted
  // The new nickname is checked against a regex and
  // Then sent to the backend for deduplication check
  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = nickNameRef.current ? nickNameRef.current.value : '';
    if (input.length > 15) {
      setInputStatus('invalidLength');
      return;
    }
    else if (!validateNameInput(input)) {
      setInputStatus('invalidName');
      return;
    }
    nicknameMutation.mutate(input, {
      onSuccess: ({ status }) => {
        if (status === 201) {
          setInputStatus('valid');
          setShowForm(false);
          queryClient.setQueryData<User>('userData', (oldData): User => {
            return {
              ...oldData!,
              nickname: input,
            };
          });
        } else if (status == 200) {
          setInputStatus('invalidTaken');
        }
      },
    });
  }

  return (
    <>
      <div
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0
          h-modal h-full bg-[#222] bg-opacity-50 "
      >
        <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow text-black p-6">
            <h3
              className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900
                p-4 border-b"
            >
              Your nickname
            </h3>
            <form onSubmit={onSubmitHandler}>
              <div
                id="form-nickname"
                className="form-group mt-4"
              >
                <label
                  className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold"
                  htmlFor="editNickName">
                  Enter a name
                </label>
                <input
                  className={`form-control block w-full my-3 px-3 py-1.5 text-xs bg-gray-50 bg-clip-padding
                  border-b-2 focus:ring-blue-500 focus:border-blue-500 focus:text-gray-500  ${
                    inputStatus === 'invalidTaken' ||
                    inputStatus === 'invalidLength' ||
                    inputStatus === 'invalidName'
                      ? 'border-red-500'
                      : ''
                  }`}
                  type="text"
                  id="nickNameInput"
                  autoComplete="off"
                  ref={nickNameRef}
                  onChange={onChangeHandler}
                ></input>
                {inputStatus === 'invalidName' && (
                  <p className="text-red-500 text-xs font-medium">
                    Invalid format: only alphanumeric characters accepted
                  </p>
                )}
                {inputStatus === 'invalidLength' && (
                  <p className="text-red-500 text-xs font-medium">
                    Name must be less than 15 characters
                  </p>
                )}
                {inputStatus === 'invalidTaken' && (
                  <p className="text-red-500 text-xs font-medium">
                    Name already taken
                  </p>
                )}
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
                <button
                  type="submit"
                  className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
    </>
  );
}

export default NickNameForm;
