import axios from 'axios';
import { Dispatch, FormEvent, useRef, useState } from 'react';

interface NicknameFormProps {
  setShowForm: Dispatch<React.SetStateAction<boolean>>;
  setNickName: Dispatch<React.SetStateAction<string>>;
}

function NickNameForm(props: NicknameFormProps) {
  const nickNameRef = useRef<HTMLInputElement>(null);
  const [inputStatus, setInputStatus] = useState<string>('empty');

  function validateNameInput(input: string): boolean {
    const regex = /^[a-zA-Z0-9]+$/;
    const ret = input.length !== 0 && input.length <= 15 && regex.test(input);
    return ret;
  }

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = nickNameRef.current ? nickNameRef.current.value : '';
    if (!validateNameInput(input)) {
      setInputStatus('invalid');
      return;
    }
    axios
      .put(
        'http://localhost:3000/user/update-nickname',
        { newNickname: input },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.status == 201) {
          setInputStatus('valid');
          props.setNickName(input);
          props.setShowForm(false);
        } else if (res.status == 200) {
          setInputStatus('invalid');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="absolute block p-6 rounded-lg shadow-lg max-w-sm bg-purple-light text-white text-xs sm:text-xs md:text-sm font-bold">
      <form onSubmit={onSubmitHandler}>
        <div className="form-group mb-6 text-center text-white text-sm sm:text-sm md:text-lg font-bold">
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
