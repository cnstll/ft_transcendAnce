import Banner from '../section-components/banner';
import backgroundGeneral from "../../img/disco2.png";

function Play () {
    return (
    <div className="h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundGeneral})` }}>
        <Banner />
    </div>
    );
}

export default Play