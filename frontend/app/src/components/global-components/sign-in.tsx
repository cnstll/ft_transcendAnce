import background from "../../img/disco.png";
import logo from "../../img/42_logo.png";

function SignIn() {
  return (
    <div className="h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
      <div className="flex flex-col h-screen justify-center items-center gap-10">
        <a href="https://google.com" className="bg-blue hover:bg-dark-blue w-2/12 h-16 rounded-2xl p-4">
          <div className="flex flex-row justify-center gap-2">
            <img src={logo} alt="Logo" className="w-2/12"/>
            <p className="text-xs sm:text-xs md:text-lg lg:text-2xl text-white font-bold"> SIGN IN</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default SignIn;