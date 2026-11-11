import { CONTACT, IDENTITY } from '../content'

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 pt-nav px-4">
      <p className="section-label">Get in Touch</p>
      <h1 className="font-display text-5xl font-bold text-center">{CONTACT.heading}</h1>
      <p className="text-muted text-center max-w-md">{CONTACT.subheading}</p>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <a
          href={CONTACT.resume}
          download
          className="btn-magnetic text-aiml border-aiml/40 hover:bg-aiml/10"
        >
          {CONTACT.resumeLabel}
        </a>
        <a
          href={CONTACT.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-magnetic text-text border-border hover:border-text"
        >
          GitHub — {IDENTITY.github}
        </a>
        <a
          href={`mailto:${CONTACT.email}`}
          className="btn-magnetic text-text border-border hover:border-text"
        >
          Email
        </a>
      </div>

      <p className="font-mono text-xs text-border border border-border rounded px-3 py-1 mt-4">
        Step 6 — polished contact form + LinkedIn incoming
      </p>
    </main>
  )
}
