import React, { FC, ReactNode } from 'react'

export interface ModalActionsProps {
  children?: ReactNode
}

const ModalActions: FC<ModalActionsProps> = ({ children }) => {
  return <div className="flex justify-end gap-4 items-center">{children}</div>
}

export default ModalActions
