import React from 'react';

function CenterBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-purple h-44 lg:h-96 xl:h-[40rem] xl:w-7/12 lg:w-7/12 md:w-1/2 sm:w-1/2 w-1/2 min-w-[280px]
      text-xl sm:text-xl md:text-2xl lg:text-3xl"
    >
      {children}
    </div>
  );
}

export default CenterBox;
