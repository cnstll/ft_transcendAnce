import React from 'react';

function OneBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-purple text-white h-[40rem] w-9/12">{children}</div>
  );
}

export default OneBox;
