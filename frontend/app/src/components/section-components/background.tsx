type BackgroundProps = {
  children: React.ReactNode;
  background: string;
}

function Background ({children, background}: BackgroundProps) {
    return (
    <div className="h-full min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
        {children}
    </div>
    );
}

export default Background
