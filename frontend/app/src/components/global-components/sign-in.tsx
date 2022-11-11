import BackgroundSignin from '../../img/disco.png';
import logo from '../../img/42_logo.png';
import Background from '../section-components/background';
import Button from '../section-components/button';
import { apiUrl } from './interface';

function SignIn() {

  return (
    <div>
      <Background background={BackgroundSignin}>
        <div className="flex flex-col h-screen justify-center items-center gap-10">
          <a href={`http://${apiUrl}/auth/42/callback`}>
            <Button>
              <div className="flex flex-row justify-center gap-2">
                <img src={logo} alt="Logo" className="w-2/12" />
                <p className="text-xs sm:text-xs md:text-lg lg:text-2xl text-white font-bold">
                  SIGN IN
                </p>
              </div>
            </Button>
          </a>
        </div>
      </Background>
    </div>
  );
}

export default SignIn;
