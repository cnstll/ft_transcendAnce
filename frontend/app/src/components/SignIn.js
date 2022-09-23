import background from "../img/disco.png";
import logo from "../img/42_logo.png";

function SignIn() {
  return (
    <div className="h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
      <div className="flex h-screen justify-center items-center">
        <a href="https://google.com" className="bg-blue hover:bg-dark-blue text-white font-bold py-2 px-4 w-2/12 h-16 rounded-2xl">
          <div className="flex justify-center items-center gap-2">
            <img src={logo} alt="Logo" className="object-contain w-2/12 h-12"/>
            <p className="text-2xl"> SIGN IN </p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default SignIn;