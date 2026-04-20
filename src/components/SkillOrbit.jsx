export default function SkillOrbit({ icons = [] }) {
  return (
    <div className="flex items-center" aria-label="Primary tools">
      {icons.map((icon, index) => (
        <div
          key={icon.id || icon.title}
          title={icon.title}
          className="relative w-[54px] h-[54px] rounded-full border border-[rgba(240,238,225,0.16)] flex items-center justify-center transition-transform hover:-translate-y-1 hover:scale-110 hover:z-10 bg-[linear-gradient(145deg,#18231e,#0f1713)]"
          style={{
            marginLeft: index === 0 ? 0 : '-14px',
            boxShadow: '0 4px 16px -8px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src={icon.iconUrl}
            alt={icon.title}
            className={`w-6 h-6 object-contain ${
              /\/black(?:[/?#]|$)/i.test(icon.iconUrl) ? 'invert' : ''
            }`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
