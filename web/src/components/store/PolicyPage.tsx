import { LEGAL_CONTACT, type Policy } from "@/data/legal";

export function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-14">
      <p className="font-display text-xs tracking-label text-grey-500 mb-3">
        NEXORA · Legal
      </p>
      <h1 className="font-display text-4xl mb-4">{policy.title}</h1>
      <p className="text-xs text-grey-400 mb-8">
        Last updated {LEGAL_CONTACT.lastUpdated}
      </p>

      <p className="text-base text-grey-600 leading-relaxed mb-10">
        {policy.intro}
      </p>

      <div className="space-y-9">
        {policy.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl mb-3">{s.heading}</h2>
            <div className="space-y-2 text-base text-grey-700 leading-relaxed">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-grey-200 pt-6 text-sm text-grey-500">
        <p className="font-display text-xs tracking-label text-grey-400 mb-2">
          Contact
        </p>
        <p>{LEGAL_CONTACT.legalEntity}</p>
        <p>{LEGAL_CONTACT.address}</p>
        <p>
          {LEGAL_CONTACT.email} · {LEGAL_CONTACT.phone}
        </p>
      </div>
    </article>
  );
}
