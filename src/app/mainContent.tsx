'use client'
import AllSportsTag from '@/components/AllSportsTag'
import ClientBetInfo from '@/components/BetInfo/ClientBetInfo'
import ClientBetSlipButtonContent from '@/components/BetslipButton/ClientBetslipButtonContent'
import { Notification } from '@/components/Noti'
import { RootLayoutHeader } from '@/layouts/root/components'
import { useTheme } from './ThemeContext'

export default function MainContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { theme } = useTheme()

  return (
    <body className={`bg-[#1A1F26] text-white text-[14px] ${theme} h-[100%]`}>
      {' '}
      {/* Wrap with ThemeProvider */}
      <Notification />
      <div className="md:max-w-[100%] h-[100%] flex flex-col overflow-hidden">
        <RootLayoutHeader />
        <div className="flex-1 overflow-hidden px-4">
          <div className="flex lg:flex-row lg:gap-2 max-lg:flex-col lg:bg-transparent h-full overflow-hidden">
            <div className="lg:w-[15vw]">
              <AllSportsTag />
            </div>
            <main className="max-md:mt-2 flex flex-col max-md:transparent lg:w-[65vw] h-full">
              {children}
            </main>
            <div className="lg:w-[20vw] py-8 max-h-full flex flex-col overflow-hidden max-lg:hidden">
              <ClientBetInfo />
              <ClientBetSlipButtonContent />
            </div>
          </div>
        </div>
      </div>
    </body>
  )
}
