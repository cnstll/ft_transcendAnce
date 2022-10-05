import BackgroundGeneral from "../../img/disco2.png";
import BackgroundSignin from "../../img/disco.png";

function Background (props) {
    return (
    <div className="h-full min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${props.background})` }}>
        {props.children}
    </div>
    );
}

export default Background
