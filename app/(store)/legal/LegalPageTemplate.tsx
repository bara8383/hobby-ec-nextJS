type LegalSection = {
  label: string;
  value: string;
};

type LegalPageTemplateProps = {
  title: string;
  lead: string;
  sections: LegalSection[];
};

export function LegalPageTemplate({ title, lead, sections }: LegalPageTemplateProps) {
  return (
    <main>
      <h1>{title}</h1>
      <p className="section-description">{lead}</p>

      <section aria-label={`${title}の本文`}>
        {sections.map((item) => (
          <article key={item.label} className="legal-item">
            <h2>{item.label}</h2>
            <p>{item.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
