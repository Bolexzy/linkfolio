const FALLBACK_THUMB =
  'radial-gradient(circle at 20% 20%, rgba(195,230,120,0.14), transparent 42%), radial-gradient(circle at 80% 30%, rgba(120,200,230,0.12), transparent 38%), repeating-linear-gradient(-12deg, rgba(240,238,225,0.04) 0 10px, transparent 10px 22px), linear-gradient(180deg, #223028, #1a2420)';

function getDomainLabel(url) {
  if (!url) {
    return 'Coming soon';
  }

  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Live project';
  }
}

export default function ProjectCard({
  title,
  description,
  tags = [],
  url,
  image,
  hoverImage,
}) {
  const eyebrow = tags.length ? tags.slice(0, 2).join(' / ') : 'Project';
  const status = url ? 'Live' : 'Soon';
  const thumbLabel = tags.length ? `[ ${tags.join(' / ')} ]` : '[ project preview ]';

  return (
    <article
      data-project
      className="group flex-shrink-0 w-[min(380px,82vw)] border border-[rgba(240,238,225,0.08)] rounded-xl p-5 flex flex-col h-[480px] relative overflow-hidden transition-all hover:border-[rgba(240,238,225,0.16)] hover:-translate-y-0.5"
      style={{
        scrollSnapAlign: 'start',
        backgroundImage: 'linear-gradient(180deg, #444c4d 0%, #04191F 100%)',
      }}
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open ${title}`}
          className="absolute top-6 right-6 z-10 w-[30px] h-[30px] rounded-full border border-[rgba(240,238,225,0.08)] flex items-center justify-center text-fg-muted text-sm transition-all group-hover:bg-accent group-hover:text-accent-ink group-hover:border-accent group-hover:-rotate-45"
        >
          -&gt;
        </a>
      ) : (
        <div className="absolute top-6 right-6 z-10 w-[30px] h-[30px] rounded-full border border-[rgba(240,238,225,0.08)] flex items-center justify-center text-fg-muted text-sm opacity-45">
          *
        </div>
      )}

      <div
        className="h-[200px] rounded-md border border-[rgba(240,238,225,0.08)] mb-6 relative overflow-hidden"
        style={{ background: FALLBACK_THUMB }}
      >
        {image ? (
          <img
            src={image}
            alt={`${title} preview`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
              hoverImage ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
            }`}
          />
        ) : null}
        {hoverImage ? (
          <img
            src={hoverImage}
            alt={`${title} alternate preview`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,23,28,0.8)] via-[rgba(4,23,28,0.18)] to-transparent" />
        {/* <span className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.1em] uppercase text-fg-dim">
          {thumbLabel}
        </span> */}
      </div>

      <div className="flex justify-between items-center font-mono text-[10px] tracking-[0.1em] uppercase text-fg-dim mb-2.5">
        <span>{eyebrow}</span>
        <span>{status}</span>
      </div>

      <h3 className="font-serif text-[30px] leading-[1.05] m-0 mb-2.5 text-fg tracking-[-0.01em] whitespace-pre-line">
        {title}
      </h3>
      <p className="text-[13px] text-fg-muted leading-[1.55] m-0 mb-4 line-clamp-3">
        {description || 'Project details coming soon.'}
      </p>

      <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-fg-dim mb-4">
        {getDomainLabel(url)}
      </div>

      <div className="flex gap-1.5 flex-wrap mt-auto">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] py-1 px-2 rounded bg-[rgba(240,238,225,0.04)] text-fg-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
