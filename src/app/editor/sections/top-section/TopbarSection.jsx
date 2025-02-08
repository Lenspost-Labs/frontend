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
import SubscriptionModal from "../../common/modals/SubscriptionModal";

const TopbarSection = () => {
  const { openedLoginModal } = useContext(Context);
  const { isAuthenticated } = useAppAuth();

  return (
    <>
      <div className="bg-white mb-2 w-full px-3 py-2 sm:overflow-x-auto sm:overflow-y-hidden sm:max-w-[100vw] sticky border">
        <div className="flex items-center justify-between">
          <Logo propHeight={96} propWidth={96} />

          {!isAuthenticated && (
            <>
              <div className="hidden md:flex items-center gap-3">
                {/* <Typography className="font-semibold text-lg">Login with</Typography> */}
                {/* <SolanaWallets title="Solana" /> */}
                <EVMWallets />
              </div>
              <MobileLoginBtn />
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center justify-center space-x-4 md:space-x-6">
              {/* Discord Links - 19Jul2023 */}
              <a
                className="md:w-8 h-8 text-gray-600 md:flex hidden transition-transform transform-gpu"
                target="_blank"
                href="https://t.me/poster_fun"
              >
                <img
                  src="/topbar-icons/tg.svg"
                  alt="poster telegram"
                  className="bg-transparent mix-blend-multiply w-full h-full transition-shadow hover:shadow-lg hover:shadow-gray-400 duration-300 ease-in-out rounded-full"
                />
              </a>

              <div id="fifth-step">
                <ShareButton />
              </div>
              <div>
                <DownloadBtn />
              </div>
              <div className="flex gap-2" id="first-step">
                {/* <ProfileMenu /> */}
                <PointsBtn />
                <SubscriptionModal />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {openedLoginModal && <LoginModal />}
    </>
  );
};

export default TopbarSection;
