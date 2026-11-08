export default function LogoSlot({ className = '' }) {
  return (
    <span className={`logo-slot ${className}`.trim()} aria-hidden="true">
      <img className="logo-slot__img" src="/assets/web.png" alt="" width="35" height="35" decoding="async" />
    </span>
  )
}
