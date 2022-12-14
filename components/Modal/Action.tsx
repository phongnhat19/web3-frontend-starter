import Button, { ButtonProps } from 'app/components/Button'
import React, { FC } from 'react'

export interface ModalActionProps extends ButtonProps {
  main?: boolean
}

const ModalAction: FC<ModalActionProps> = ({ children, disabled, main = false, ...props }) => {
  return (
    <Button className="bg-secondary-600" {...props} size="sm" disabled={disabled} variant={main ? 'filled' : 'empty'}>
      {children}
    </Button>
  )
}

export default ModalAction
