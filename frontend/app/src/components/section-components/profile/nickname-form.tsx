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
  // When pressing enter the new nickname is submitted
  // The new nickname is checked against a regex and
  // Then sent to the backend for deduplication check
  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = nickNameRef.current ? nickNameRef.current.value : '';
    if (!validateNameInput(input)) {
      setInputStatus('invalid');
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
          setInputStatus('invalid');
        }
      },
    });
  }

  return (
    <div className="absolute block p-6 mr-6 rounded-lg shadow-lg max-w-20 bg-purple-light text-white text-xs sm:text-xs md:text-sm font-bold z-20">
      <form onSubmit={onSubmitHandler}>
        <div
          id="form-nickname"
          className="form-group mb-6 text-center text-white text-sm sm:text-sm md:text-lg font-bold"
        >
          <label htmlFor="editNickName">Enter your name</label>
          <input
            className={`form-control block w-full px-3 py-1.5 text-base font-normal bg-purple-light focus:bg-purple-light bg-clip-padding border-b-2 focus:outline-none ${
              inputStatus !== 'invalid'
                ? 'border-white focus:text-white'
                : 'border-red-500 focus:text-red-500'
            }`}
            type="text"
            id="nickNameInput"
            ref={nickNameRef}
            onInput={() => setInputStatus('typing')}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default NickNameForm;
