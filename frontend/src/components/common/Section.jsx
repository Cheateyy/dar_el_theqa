function Section({ title, children }) {
  return (
    <section className="form-section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}

export default Section;
