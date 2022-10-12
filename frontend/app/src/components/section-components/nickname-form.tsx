import { FormEvent, useRef } from 'react';
import { useState } from 'react';

const mockupDb = [
  { nickName: 'Bob' },
  { nickName: 'Mary' },
  { nickName: 'Alice' },
];

function NickNameForm() {
  const nicknameRef = useRef(null);
  const [nameNotValid, setNameNotValid] = useState(false);
  function onInputHandler() {
    setNameNotValid(false);
  }

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      mockupDb.some((entry) => {
        return entry.nickName == nicknameRef.current.value;
      })
    ) {
      setNameNotValid(true);
    } else {
      console.log("It's fine!");
    }
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
          {nameNotValid && <div> NOT GOOD</div>}
        </div>
      </form>
    </div>
  );
}

export default NickNameForm;
