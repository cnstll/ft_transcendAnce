function NickNameForm() {
  const inputStyle =
    'form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';
  const componentStyle =
    'absolute block p-6 rounded-lg shadow-lg max-w-sm bg-purple-light text-white text-xs sm:text-xs md:text-sm font-bold';
  const buttonStyle =
    'px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out';
  return (
    <div className={componentStyle}>
      <form>
        <div className="">
          <label htmlFor="nickNameInput"> Enter your name : </label>
          <input
            className={inputStyle}
            type="text"
            required
            id="nickNameInput"
          ></input>
        </div>
        <div className={buttonStyle}>
          <button> Submit </button>
        </div>
      </form>
    </div>
  );
}

export default NickNameForm;
