import Background from '../section-components/background';
import BackgroundSignin from '../../img/disco.png';
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useRef, useState } from 'react';
import { validate2faCode } from '../query-hooks/set2fa';

function SignIn2FA() {
  const validate2faMutation = validate2faCode();
  const [validCode, setValidCode] = useState<boolean>(true);
  const verficationCodeRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = verficationCodeRef.current
      ? verficationCodeRef.current.value
      : '';
    validate2faMutation.mutate(input, {
      onSuccess: () => {
        setValidCode(true);
        navigate('/');
      },
      onError: () => {
        setValidCode(false);
      },
    });
  }

  return (
    <div>
      <Background background={BackgroundSignin}>
        <div className="flex flex-col h-screen justify-center items-center p-4">
          <h1 className="text-4xl lg:text-6xl md:text-2xl sm:text-xl text-white mb-4">
            Welcome Back
          </h1>
          <form
            onSubmit={onSubmitHandler}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-gray-50
            `rounded-2xl p-8 space-y-5"
          >
            <h2 className="text-center text-3xl font-semibold text-purple-light">
              Two-Factor Authentication
            </h2>
            <p className="text-center lg:text-sm md:text-sm text-xs">
              Open the two-step verification app on your mobile device to get
              your verification code.
            </p>
            <input
              placeholder="Authentication Code"
              className={`bg-gray-50 border lg:text-sm md:text-sm text-xs
                rounded-lg focus:ring-blue focus:border-blue block p-3 w-full
                ${
                  validCode
                    ? 'border-gray-300 text-gray-900'
                    : ' border-red-500 text-red-500'
                }`}
              ref={verficationCodeRef}
            />
            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-lg outline-none border-none
                flex justify-center bg-purple-light text-white"
            >
              Authenticate
            </button>
            <span className="block text-center">
              <Link to="/sign-in" className="text-purple">
                Back to basic login
              </Link>
            </span>
          </form>
        </div>
      </Background>
    </div>
  );
}

export default SignIn2FA;
