export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Privacy Policy
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        We only collect information needed for inquiry communication.
      </h1>

      <div className="mt-8 space-y-6 text-stone-700">
        <p>
          When you submit an inquiry, we may collect your name, email address,
          company name, country, message content, and selected inquiry items.
        </p>

        <p>
          This information is used to understand your sourcing request, reply to
          your inquiry, prepare quotations, and improve our service process.
        </p>

        <p>
          We do not sell your inquiry information. Access to inquiry data is
          limited to administrative use for business follow-up.
        </p>
      </div>
    </main>
  );
}
