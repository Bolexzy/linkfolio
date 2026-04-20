export default function Portrait({ src }) {
  const portraitSrc =
    src ||
    'https://res.cloudinary.com/dtwdlzej8/image/upload/v1776471897/photo_2026-04-18_01-10-02_e7eiaq.jpg';

  return (
    <div
      className="relative rounded-full max-[900px]:w-[170px]"
      style={{ width: '200px', aspectRatio: '3 / 4.2' }}
    >
      <div className="portrait-glow" />
      <div
        className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-bg"
        style={{
          background:
            'repeating-linear-gradient(135deg, rgba(240,238,225,0.04) 0 8px, transparent 8px 16px), linear-gradient(180deg, #2a3730, #1b2620)',
        }}
      >
        <img
          src={portraitSrc}
          alt="Boluwatife Emmanuel"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
