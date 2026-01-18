import { clsx } from 'clsx'

export function Table({ children, className }) {
  return (
    <div className="table-container">
      <table className={clsx('table', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }) {
  return <thead>{children}</thead>
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-morning-muted">{children}</tbody>
}

export function TableRow({ children, className, onClick }) {
  return (
    <tr 
      className={clsx(onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export function TableHeader({ children, className }) {
  return <th className={className}>{children}</th>
}

export function TableCell({ children, className }) {
  return <td className={className}>{children}</td>
}
