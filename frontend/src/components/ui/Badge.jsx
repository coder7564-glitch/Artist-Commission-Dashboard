import { clsx } from 'clsx'

const variants = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  gray: 'badge-gray',
}

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx(variants[variant], className)}>
      {children}
    </span>
  )
}

// Status badge helper
export function StatusBadge({ status }) {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'warning' },
    accepted: { label: 'Accepted', variant: 'primary' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    revision: { label: 'Revision', variant: 'warning' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
    rejected: { label: 'Rejected', variant: 'error' },
    // Payment statuses
    processing: { label: 'Processing', variant: 'primary' },
    failed: { label: 'Failed', variant: 'error' },
    refunded: { label: 'Refunded', variant: 'gray' },
    // Artist statuses
    approved: { label: 'Approved', variant: 'success' },
    suspended: { label: 'Suspended', variant: 'error' },
  }

  const config = statusConfig[status] || { label: status, variant: 'gray' }
  
  return <Badge variant={config.variant}>{config.label}</Badge>
}
