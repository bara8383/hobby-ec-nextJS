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
      <p>{lead}</p>

      <dl className="legal-list">
        {sections.map((item) => (
          <div key={item.label} className="legal-item">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
