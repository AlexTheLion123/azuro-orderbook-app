'use client'

import Betslip from "@/components/BetslipButton/Betslip";
import MyBets from "@/components/BetslipButton/MyBets";
import { useBreakpoints } from "@/hooks";
import { Icons, IconsProps } from "@/icons";
import clsx from "clsx";
import React, { useEffect } from "react";

const PADDING = 40

type BetTabOption = {
    label: string
    icon: IconsProps['name']
}

const betTabOptions: BetTabOption[] = [
    { label: 'Betslip', icon: 'judge' },
    { label: 'My Bets', icon: 'receipt' },
]

export type HeaderProps = {
    type: string
    setType: (type: string) => void
    setIsOpen: (isOpen: boolean) => void
}

const Header = ({ type, setType, setIsOpen }: Readonly<HeaderProps>) => {
    return (
        <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-2 h-[56px] rounded-full bg-[#FFFFFF0D] p-2 w-fit">
                {betTabOptions.map((item: { label: string; icon: string }) => (
                    <button
                        key={item.label}
                        className={clsx(
                            'flex items-center justify-center px-4 rounded-full h-full w-fit hover:bg-[#FFFFFF] hover:text-black cursor-pointer',
                            {
                                'text-[#868C98]': type !== item.label,
                                'bg-[#FFFFFF] text-black': type === item.label,
                            }
                        )}
                        onClick={() => {
                            setType(item.label)
                        }}
                    >
                        <Icons name={item.icon} />
                        {item.label}
                    </button>
                ))}
            </div>
            <span className="lg:hidden">
                <Icons
                    name="closeCircle"
                    className="cursor-pointer"
                    onClick={() => {
                        setIsOpen(false)
                    }}
                />
            </span>
        </div>
    )
}

export default function BetslipButtonContent({ isOpen, setIsOpen }: Readonly<{ isOpen: boolean, setIsOpen: (isOpen: boolean) => void }>) {
    const [type, setType] = React.useState(betTabOptions[0].label)
    
    // const betslipButtonRef = React.useRef<HTMLDivElement>(null)
    //calc height of the betslip content from "Betslip" to bottom of the screen
    // const [height, setHeight] = React.useState(0)
    // useEffect(() => {
    //     setHeight(
    //         window.innerHeight -
    //         Number(betslipButtonRef.current?.getBoundingClientRect().top) -
    //         Number(betslipButtonRef.current?.getBoundingClientRect().height) -
    //         PADDING
    //     )
    // }, [])

    const onClose = () => {
        setIsOpen(false)
    }

    return (
        <div
            className={clsx(
                'max-lg:absolute z-[3] right-0 max-lg:max-w-[calc(100vw-2rem)] max-h-[84vh] w-[450px] bg-[#252A31] rounded-2xl p-4 overflow-hidden flex flex-col',
                {
                    hidden: !isOpen,
                },
                'max-lg:mt-2 max-lg:80vh',
                'shadow-[0_0px_300px_24px_rgb(0_0_0_/_80%)]'
            )}
            // style={{
            //     height: `80vh`,
            //     top:
            //         Number(betslipButtonRef.current?.getBoundingClientRect().height) +
            //         PADDING / 2 +
            //         'px',
            //     boxShadow: '0 0px 300px 24px rgb(0 0 0 / 80%)',
            // }}
        >
            <Header type={type} setType={setType} setIsOpen={setIsOpen} />
            <div className="mt-4 flex-1 overflow-hidden flex flex-col">
                {type === betTabOptions[0].label ? (
                    <Betslip onClose={onClose} />
                ) : (
                    <MyBets />
                )}
            </div>
        </div>
    )
}