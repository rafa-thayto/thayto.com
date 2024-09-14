import { IconProps } from './types'

export const Twitch = ({ color }: IconProps) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    style={{ color: color || '#121212' }}
    height="24px"
    width="24px"
    xmlns="https://www.w3.org/2000/svg"
    aria-label="Twitter"
  >
    <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z" />
    <path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z" />
  </svg>
)