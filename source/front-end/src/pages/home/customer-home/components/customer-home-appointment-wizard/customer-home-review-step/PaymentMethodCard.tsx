interface PaymentMethodParameters {
  icon: React.ComponentType<{ className?: string }>
  name: string
}

function PaymentMethodCard(props: PaymentMethodParameters) {
  return (
    <div className="bg-[#323131] border-secondary-300 flex items-center gap-4 rounded-xl p-2 transition-all hover:border-l-2">
      <props.icon className="size-6" />
      <p>{props.name}</p>
    </div>
  )
}

export default PaymentMethodCard
