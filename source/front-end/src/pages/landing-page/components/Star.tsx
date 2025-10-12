function Star({ fillPercent, id }: { fillPercent: number; id: string }) {
  const gradId = `grad-${id}`
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0%" x2="100%">
          <stop
            offset={`${Math.max(0, Math.min(fillPercent, 100))}%`}
            stopColor="#977458"
          />
          <stop
            offset={`${Math.max(0, Math.min(fillPercent, 100))}%`}
            stopColor="#e4e5e9"
          />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  )
}

export default Star
