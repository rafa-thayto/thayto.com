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
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
            isScrolled
              ? 'py-2 px-4 sm:px-6 lg:px-8'
              : 'py-4 px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`relative mx-auto backdrop-blur-md rounded-2xl transition-all duration-500 ease-out ${
              isScrolled
                ? 'max-w-5xl bg-white/75 dark:bg-black/60 border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20'
                : 'max-w-6xl bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/15 shadow-lg shadow-black/5 dark:shadow-black/10 hover:bg-white/70 dark:hover:bg-black/50 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/25'
            }`}
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent"
              style={{
                background: isScrolled
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
              }}
            />

            <div
              className={`relative flex items-center justify-between transition-all duration-500 ease-out ${
                isScrolled ? 'px-4 py-2.5' : 'px-6 py-3.5'
              }`}
            >
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-3 group">
                  <span
                    className={`font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent transition-all duration-500 ease-out ${
                      isScrolled ? 'text-lg' : 'text-xl'
                    } group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 dark:group-hover:from-blue-400 dark:group-hover:via-purple-400 dark:group-hover:to-blue-400`}
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
                    className={`font-medium text-gray-700/90 dark:text-gray-200/90 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-105 relative group ${
                      isScrolled ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <div
                  className={`transition-all duration-500 ease-out ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}
                >
                  <ThemeSwitcher />
                </div>

                <div className="md:hidden">
                  <Popover.Button
                    className={`inline-flex items-center justify-center rounded-xl text-gray-600/80 dark:text-gray-300/80 hover:bg-white/30 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm ${
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
          className={`transition-all duration-500 ease-out ${
            isScrolled ? 'h-16' : 'h-20'
          }`}
        />

        <Transition
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95 translate-y-[-10px]"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-[-10px]"
        >
          <Popover.Panel
            focus
            className="fixed z-50 top-0 inset-x-0 p-4 transition transform origin-top md:hidden"
          >
            <div
              className="max-w-sm mx-auto rounded-2xl bg-white/80 dark:bg-black/70 ring-1 ring-white/20 dark:ring-white/10 overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 border border-white/30 dark:border-white/15 backdrop-blur-lg"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none" />

              <div className="relative px-6 pt-6 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Rafael Thayto
                  </span>
                </div>
                <div>
                  <Popover.Button className="bg-white/50 dark:bg-white/10 rounded-xl p-2 inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm">
                    <span className="sr-only">Close main menu</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <div className="relative px-4 pt-4 pb-6 space-y-1">
                {navigation.map((item) => (
                  <Popover.Button
                    as={Link}
                    key={`${item.name}-${menuId}`}
                    href={item.href}
                    onClick={item.onClick}
                    className="block w-full px-4 py-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 backdrop-blur-sm"
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
