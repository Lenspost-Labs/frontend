import ShareButton from "./share/ShareButton";
import DownloadBtn from "./download/DownloadBtn";
import { useAppAuth } from "../../../../hooks/app";
import { Typography } from "@material-tailwind/react";
import { EVMWallets, SolanaWallets } from "./auth/wallets";
import Logo from "./logo/Logo";
import PointsBtn from "./PointsBtn/PointsBtn";
import MobileLoginBtn from "./auth/MobileLoginBtn";
import { useContext } from "react";
import LoginModal from "./auth/LoginModal";
import { Context } from "../../../../providers/context";
import usePrivyAuth from "../../../../hooks/privy-auth/usePrivyAuth";

const TopbarSection = () => {
  const { openedLoginModal } = useContext(Context);
  const { isAuthenticated } = useAppAuth();
  const { login } = usePrivyAuth();

  return (
    <>
      <div className="bg-white mb-2 w-full px-3 py-2 sm:overflow-x-auto sm:overflow-y-hidden sm:max-w-[100vw] sticky border">
        <div className="flex items-center justify-between">
          <Logo />

          {!isAuthenticated && (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Typography className="font-semibold text-lg">
                  Login with
                </Typography>
                <SolanaWallets title="Solana" />
                <EVMWallets title="EVM" login={login} />
              </div>
              <MobileLoginBtn />
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center justify-center space-x-4 md:space-x-6">
              {/* Discord Links - 19Jul2023 */}
              <a
                className="md:w-8 h-8 text-gray-600 md:flex hidden transition-transform transform-gpu hover:scale-125 hover:rotate-180 hover:duration-2000"
                target="_blank"
                href="https://discord.gg/yHMXQE2DNb"
              >
                <img src="/topbar-icons/iconDiscord.svg" alt="" />
              </a>

              <div id="fifth-step">
                <ShareButton />
              </div>
              <div>
                <DownloadBtn />
              </div>
              <div className="" id="first-step">
                {/* <ProfileMenu /> */}
                <PointsBtn />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {openedLoginModal && <LoginModal login={login} />}
    </>
  );
};

export default TopbarSection;
