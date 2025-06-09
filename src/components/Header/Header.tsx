import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import { Fragment, useState, useEffect } from 'react'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { ThemeSwitcher } from '../theme-switcher/theme-switcher'

export const Header = () => {
  const navbarId = nanoid()
  const menuId = nanoid()

  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={width - 16}
          height={height - 16}
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
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? 'py-2 px-4 sm:px-6 lg:px-8'
              : 'py-4 px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`relative mx-auto backdrop-blur-sm rounded-xl border transition-all duration-300 ${
              isScrolled
                ? 'max-w-5xl bg-white/95 dark:bg-gray-900/95 border-gray-200/70 dark:border-gray-700/70 shadow-lg'
                : 'max-w-6xl bg-white/90 dark:bg-gray-900/90 border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md'
            }`}
          >
            <div
              className={`flex items-center justify-between transition-all duration-300 ${
                isScrolled ? 'px-4 py-2' : 'px-6 py-3'
              }`}
            >
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-3 group">
                  <span
                    className={`font-semibold text-gray-900 dark:text-white transition-all duration-300 ${
                      isScrolled ? 'text-lg' : 'text-xl'
                    }`}
                  >
                    Rafael Thayto
                  </span>
                </Link>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={`${item.name}-${navbarId}`}
                    href={item.href}
                    onClick={item.onClick}
                    className={`font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ${
                      isScrolled ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <div
                  className={`transition-all duration-300 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}
                >
                  <ThemeSwitcher />
                </div>

                <div className="md:hidden">
                  <Popover.Button
                    className={`inline-flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      isScrolled ? 'p-1.5' : 'p-2'
                    }`}
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon
                      className={`transition-all duration-300 ${
                        isScrolled ? 'h-4 w-4' : 'h-5 w-5'
                      }`}
                      aria-hidden="true"
                    />
                  </Popover.Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}
        />

        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="fixed z-50 top-0 inset-x-0 p-4 transition transform origin-top md:hidden"
          >
            <div className="max-w-sm mx-auto rounded-xl bg-white dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/5 overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 pt-6 flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Rafael Thayto
                  </span>
                </div>
                <div>
                  <Popover.Button className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                    <span className="sr-only">Close main menu</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <div className="px-4 pt-4 pb-6 space-y-1">
                {navigation.map((item) => (
                  <Popover.Button
                    as={Link}
                    key={`${item.name}-${menuId}`}
                    href={item.href}
                    onClick={item.onClick}
                    className="block w-full px-4 py-3 rounded-lg text-left font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Popover.Button>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  )
}
