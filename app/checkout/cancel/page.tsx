export default function CheckoutCancelPage() {
  return (
    <main className="w-full bg-white dark:bg-zinc-950 min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-500">Payment Cancelled</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Your payment was cancelled. No charges were made.</p>
      </div>
    </main>
  );
}
