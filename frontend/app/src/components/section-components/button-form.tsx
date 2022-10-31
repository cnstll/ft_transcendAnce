interface ButtonProps {
  children: React.ReactNode;
}

function ButtonForm({ children }: ButtonProps) {
  return (
    <div
      className="bg-purple hover:bg-dark-blue text-white flex justify-center items-center
        w-22 h-10 my-4
        rounded-2xl text-center"
    >
      {children}
    </div>
  );
}

export default ButtonForm;
