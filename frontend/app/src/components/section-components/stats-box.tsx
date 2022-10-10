function StatBox() {
  return (
    <div className="bg-purple p-5 h-24 text-center text-white">
      <h1 className="text-xl">STATS</h1>
      <div className="grid grid-cols-3 text-sm sm:text-base md:text-lg lg:text-xl h-16">
        <p>🏆</p>
        <p>❌</p>
        <p>👑</p>
      </div>
    </div>
  );
}

export default StatBox;
