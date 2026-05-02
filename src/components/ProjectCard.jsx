const FALLBACK_THUMB =
  'radial-gradient(circle at 20% 20%, rgba(195,230,120,0.14), transparent 42%), radial-gradient(circle at 80% 30%, rgba(120,200,230,0.12), transparent 38%), repeating-linear-gradient(-12deg, rgba(240,238,225,0.04) 0 10px, transparent 10px 22px), linear-gradient(180deg, #223028, #1a2420)';

export default function ProjectCard({
  title,
  description,
  tags = [],
  url,
  image,
  hoverImage,
}) {
  return (
    <article
      data-project
      className="group flex-shrink-0 w-[min(380px,82vw)] ring-1 ring-inset ring-[rgba(240,238,225,0.08)] rounded-xl flex flex-col h-[480px] relative overflow-hidden transition-all hover:ring-[rgba(240,238,225,0.16)] hover:-translate-y-0.5"
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
          className="absolute top-4 right-4 z-10 w-[30px] h-[30px] rounded-full border border-[rgba(240,238,225,0.08)] flex items-center justify-center text-fg-muted text-sm transition-all group-hover:bg-accent group-hover:text-accent-ink group-hover:border-accent group-hover:-rotate-45"
        >
          -&gt;
        </a>
      ) : (
        <div className="absolute top-4 right-4 z-10 w-[30px] h-[30px] rounded-full border border-[rgba(240,238,225,0.08)] flex items-center justify-center text-fg-muted text-sm opacity-45">
          *
        </div>
      )}

      <div
        className="h-[260px] flex-shrink-0 relative overflow-hidden"
        style={{ background: FALLBACK_THUMB }}
      >
        {image ? (
          <img
            src={image}
            alt={`${title} preview`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
              hoverImage ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
            }`}
          />
        ) : null}
        {hoverImage ? (
          <img
            src={hoverImage}
            alt={`${title} alternate preview`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-100 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-110"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,23,28,0.85)] via-[rgba(4,23,28,0.15)] to-transparent" />
      </div>

      <div className="flex flex-col flex-1 px-5 py-4">
        <h3 className="font-syne font-semibold text-[24px] leading-[1.1] m-0 mb-2 text-fg tracking-[-0.02em] whitespace-pre-line">
          {title}
        </h3>

        <p className="text-[13px] text-fg-muted leading-[1.55] m-0 mb-3 line-clamp-4">
          {description || 'Project details coming soon.'}
        </p>

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
      </div>
    </article>
  );
}
