interface OneBoxProps {
  children: React.ReactNode;
}

function OneBox({ children }: OneBoxProps) {
  return (
    <div className="bg-purple text-white h-[40rem] w-9/12">{children}</div>
  );
}

export default OneBox;
