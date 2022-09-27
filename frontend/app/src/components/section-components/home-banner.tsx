import { Link } from 'react-router-dom';

function HomeBanner ()
{
    return (
        <Link to="/">
            <h1 className="px-5 py-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
                TRANSCENDANCE 🕺
            </h1>
        </Link>
    );
}

export default HomeBanner