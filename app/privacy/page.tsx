import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Alexpoeima Art",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 text-zinc-900 dark:text-white">
      <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        <h1 className="text-3xl font-bold tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-4">
          Privacy Policy
        </h1>

        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            At <strong>Alexpoeima Art</strong>, we value your privacy and are committed to protecting your personal information.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">1. Information We Collect</h2>
          <p>
            When you purchase artwork or register an account, we collect personal information such as your name, email address, shipping address, and payment details required to process your order.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">2. How We Use Your Information</h2>
          <p>
            Your information is strictly used for fulfilling orders, providing customer support, processing transactions, and delivering order status updates.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">3. Third-Party Services</h2>
          <p>
            We process payments and store management securely through <strong>Prado Commerce</strong> and encrypted payment gateways. We do not sell or rent your personal data to third parties.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">4. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact us at support@alexpoeima.com.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Return to Store
          </Link>
        </div>

      </div>
    </main>
  );
}
