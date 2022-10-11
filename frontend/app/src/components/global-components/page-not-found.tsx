import backgroundGeneral from '../../img/disco2.png';

function PageNotFound() {
  return (
    <div
      className="h-screen bg-cover bg-no-repeat flex justify-center items-center"
      style={{ backgroundImage: `url(${backgroundGeneral})` }}
    >
      \
      <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        404 Page not found
      </h1>
    </div>
  );
}

export default PageNotFound;
