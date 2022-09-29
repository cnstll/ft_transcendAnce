import background from "../../img/disco.png";
import logo from "../../img/42_logo.png";

function SignIn() {
  return (
    <div className="h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
      <div className="flex h-screen justify-center items-center">
        <a href="http://localhost:3000/auth/signin" className="bg-blue hover:bg-dark-blue py-2 px-4 w-2/12 h-16 rounded-2xl">
          <div className="flex justify-center items-center gap-2">
            <img src={logo} alt="Logo" className="object-contain w-2/12 h-12"/>
            <p className="text-xs sm:text-xs md:text-lg lg:text-2xl text-white font-bold"> SIGN IN</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default SignIn;