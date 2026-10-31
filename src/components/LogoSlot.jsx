export default function LogoSlot({ className = '' }) {
  return (
    <span className={`logo-slot ${className}`.trim()} aria-hidden="true">
      <span className="logo-slot__corner logo-slot__corner--tl" />
      <span className="logo-slot__corner logo-slot__corner--tr" />
      <span className="logo-slot__corner logo-slot__corner--bl" />
      <span className="logo-slot__corner logo-slot__corner--br" />
    </span>
  )
}
