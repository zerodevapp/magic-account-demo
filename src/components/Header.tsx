import logo from '../assets/logo.png';
import { ConnectButton } from './auth/ConnectButton';

function Header() {
  return (
    <header className="w-full p-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <img
          src={logo}
          alt="Magic Account Logo"
          className="h-16 object-contain"
        />
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;