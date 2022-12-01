import { FC } from 'react'

interface DividerProps {
  className?: string
  vertical?: boolean
}

const Divider: FC<DividerProps> = ({ className = '', vertical = false }) => {
  if (vertical) {
    return (
      <div className={className} />
    )
  }
  return <hr className={className ? className : 'border-dark-700'} />
}

export default Divider
