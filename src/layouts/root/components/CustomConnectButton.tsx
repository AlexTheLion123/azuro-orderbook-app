import { useTheme } from '@/app/ThemeContext'
import { useBreakpoints } from '@/hooks'
import Icons from '@/icons'
import { emojiAvatarForAddress } from '@/utils'
import type { AvatarComponent } from '@rainbow-me/rainbowkit'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'

const CustomAvatar: AvatarComponent = ({ address, size }) => {
  const emoji = emojiAvatarForAddress(address)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: emoji?.color,
      }}
    >
      {emoji?.emoji}
    </div>
  )
}

const CustomConnectButton = () => {
  const breakpoints = useBreakpoints()
  const { theme } = useTheme()
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'

        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div>
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="rounded-lg text-sm font-normal px-4 py-2 text-white"
                    style={{
                      background:
                        'linear-gradient(253.66deg, #658eff 12.88%, #B37ED3 50.05%, #c2d2ff 88.76%)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icons name="connectWallet" />
                      <p className="max-sm:hidden">Connect wallet</p>
                      <p className="sm:hidden">Connect</p>
                    </div>
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-red-500 rounded-lg px-4 py-2 text-white"
                  >
                    Wrong network
                  </button>
                )
              }

              return (
                <button
                  onClick={openAccountModal}
                  type="button"
                  className={clsx(
                    'flex items-center bg-[#FFFFFF0D] rounded-xl px-4 py-2 gap-3 whitespace-nowrap',
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  )}
                >
                  {!breakpoints.isXs && (
                    <span className="font-normal text-xs whitespace-nowrap">
                      {account.displayBalance}
                    </span>
                  )}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 min-w-[26px] min-h-[26px] rounded-full flex items-center justify-center">
                    <CustomAvatar address={account.address} size={26} />
                  </div>
                  {breakpoints.isMinLg && (
                    <span
                      className={clsx(
                        'font-medium text-xs whitespace-nowrap',
                        theme === 'dark' ? 'text-[#FFFFFF99]' : 'text-gray-800'
                      )}
                    >
                      {account.displayName}
                    </span>
                  )}
                  <Icons name="chevronDown" />
                </button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default CustomConnectButton
