export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Privacy Policy
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        We only collect information needed to answer your request.
      </h1>

      <div className="mt-8 space-y-6 text-stone-700">
        <p>
          When you submit a request, we may collect your name, email address,
          country, message content, selected cart items, and optional contact or
          company details if you provide them.
        </p>

        <p>
          This information is used to understand your product question, confirm
          availability, discuss shipping, reply to your request, and improve our
          service process.
        </p>

        <p>
          We do not sell your request information. Access is limited to
          administrative use for customer support and order communication.
        </p>
      </div>
    </main>
  );
}
