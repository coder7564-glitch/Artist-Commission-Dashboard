import { clsx } from 'clsx'

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={clsx(
        hover ? 'card-hover' : 'card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx('text-lg font-semibold text-morning-darker', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }) {
  return (
    <p className={clsx('text-sm text-morning-gray mt-1', className)}>
      {children}
    </p>
  )
}
