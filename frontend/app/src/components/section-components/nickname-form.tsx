import axios from 'axios';
import { FormEvent, useRef } from 'react';
import { useState } from 'react';

function NickNameForm() {
  const nicknameRef = useRef<HTMLInputElement>(null);
  const [nameIsValid, setNameIsValid] = useState(0);

  function onInputHandler() {
    setNameIsValid(0);
  }

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nickname = nicknameRef.current ? nicknameRef.current.value : null;
    console.log(nickname);
    axios
      .put(
        'http://localhost:3000/user/update-nickname',
        { newNickname: nickname },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.status == 201) {
          setNameIsValid(1);
        } else if (res.status == 200) {
          setNameIsValid(2);
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
          <label className="">Enter your name</label>
          <input
            className="form-control block w-full px-3 py-1.5 text-base font-normal bg-purple-light focus:bg-purple-light bg-clip-padding border-b-2 border-white focus:text-white focus:outline-none"
            type="text"
            required
            id="nickNameInput"
            ref={nicknameRef}
            onInput={onInputHandler}
          ></input>
          {nameIsValid === 2 && <div> NOT GOOD</div>}
          {nameIsValid === 1 && <div> GOOD ! </div>}
        </div>
        <div>
          <button> Submit </button>
        </div>
      </form>
    </div>
  );
}

export default NickNameForm;
