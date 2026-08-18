import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="w-full bg-white dark:bg-zinc-950 flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-500 mb-4">Payment Successful!</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Thank you for your order. We will process it shortly and send you an email confirmation.
        </p>
        <Link 
          href="/" 
          className="inline-block w-full justify-center rounded-md bg-[#9e8b43] hover:bg-[#8a7833] px-3 py-2.5 text-sm font-bold text-white transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
