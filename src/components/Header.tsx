import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";
import { ConnectButton } from "./auth/ConnectButton";

const developers = [
  { name: "Docs", href: "https://docs.zerodev.app/magic-account" },
  {
    name: "Source Code",
    href: "https://github.com/zerodevapp/magic-account-demo",
  },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="https://magicaccount.io/" className="-m-1.5 p-1.5">
            <span className="sr-only">Magic Account</span>
            <img
              src={logo}
              alt="Magic Account Logo"
              className="h-16 w-auto object-contain"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <PopoverGroup className="hidden lg:flex lg:gap-x-12 items-center">
            <a
              href="https://magicaccount.io/"
              className="relative font-semibold text-sm leading-6 text-[#0A1524] hover:text-[#0A1524] transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#2f6fce] after:to-[#63bdcc] after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </a>
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-[#0A1524]">
                Developers
                <ChevronDownIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </PopoverButton>

              <PopoverPanel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                    {developers.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900">
                            {item.name}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
            <a
              href="https://www.youtube.com/watch?v=wIJViQgZFH0"
              target="_blank"
              rel="noopener noreferrer"
              className="relative font-semibold text-sm leading-6 text-[#0A1524] hover:text-[#0A1524] transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#2f6fce] after:to-[#63bdcc] after:transition-all after:duration-300 hover:after:w-full"
            >
              Video Walkthrough
            </a>
            <a
              href="https://t.me/derek_chiang"
              target="_blank"
              rel="noopener noreferrer"
              className="relative font-semibold text-sm leading-6 text-[#0A1524] hover:text-[#0A1524] transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#2f6fce] after:to-[#63bdcc] after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </a>
            <div className="leading-6">
              <ConnectButton />
            </div>
          </PopoverGroup>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="https://magicaccount.io/" className="-m-1.5 p-1.5">
              <span className="sr-only">Magic Account</span>
              <img
                src={logo}
                alt="Magic Account Logo"
                className="h-16 w-auto object-contain"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="https://magicaccount.io/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Home
                </a>
                <a
                  href="https://docs.zerodev.app/magic-account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Docs
                </a>
                <a
                  href="https://github.com/zerodevapp/magic-account-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Source Code
                </a>
                <a
                  href="https://www.youtube.com/watch?v=wIJViQgZFH0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Video Walkthrough
                </a>
                <a
                  href="https://t.me/derek_chiang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Contact
                </a>
              </div>
              <div className="py-6">
                <ConnectButton />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default Header;
