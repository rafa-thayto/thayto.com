import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { ThemeSwitcher } from '../theme-switcher/theme-switcher'

export const Header = () => {
  const navbarId = nanoid()
  const menuId = nanoid()

  const confettiWidth = useRef(0)
  const confettiHeight = useRef(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const navigation = [
    {
      name: ';)',
      href: '#',
      onClick: () => {
        setShowConfetti(true)
      },
    },
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    // { name: 'About', href: '/about' },
  ]

  useEffect(() => {
    function handleResize() {
      confettiWidth.current = window.screen.width
      confettiHeight.current = window.screen.height
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={confettiWidth.current}
          height={confettiHeight.current}
          recycle={false}
          numberOfPieces={800}
          tweenDuration={15000}
          gravity={0.15}
          onConfettiComplete={() => {
            setShowConfetti(false)
          }}
        />
      )}
      <Popover>
        <div className="relative px-4 sm:px-6 lg:px-40 py-4 lg:py-6 bg-slate-50 dark:bg-gray-900 flex justify-between align-center">
          <div className="w-28 hidden md:block" />
          <nav
            className="relative flex items-center justify-between sm:h-10 lg:justify-center"
            aria-label="Global"
          >
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <div className="-mr-2 flex items-center md:hidden">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-slate-50 dark:bg-slate-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 p-2">
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={`${item.name}-${navbarId}`}
                  href={item.href}
                  onClick={item.onClick}
                  className="font-medium text-lg text-gray-500 dark:text-slate-500 underlined hover:text-gray-500 dark:hover:text-slate-500 focus:text-gray-500 dark:focus:text-slate-500 px-5 py-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="w-28">
            <ThemeSwitcher />
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          >
            <div className="rounded-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 pt-4 flex items-center justify-end">
                <div className="-mr-2">
                  <Popover.Button className="bg-white dark:bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400  hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close main menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={`${item.name}-${menuId}`}
                    href={item.href}
                    onClick={item.onClick}
                    className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  )
}
