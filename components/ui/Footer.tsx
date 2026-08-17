import Link from "next/link";

function AmexIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-[#006FCF] flex items-center justify-center flex-shrink-0 text-white font-black text-[9px] tracking-tighter select-none">
      AMEX
    </div>
  );
}

function VisaIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-[#1434CB] flex items-center justify-center flex-shrink-0 select-none">
      <span className="text-[10px] font-black italic text-white tracking-wider">VISA</span>
    </div>
  );
}

function MastercardIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-[#1A1818] flex items-center justify-center flex-shrink-0 select-none">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-[#EB001B]"></div>
        <div className="w-3 h-3 rounded-full bg-[#F79E1B] -ml-1.5 opacity-90"></div>
      </div>
    </div>
  );
}

function PaypalIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center flex-shrink-0 select-none">
      <span className="text-[11px] font-black italic tracking-tighter text-[#003087]">P</span>
      <span className="text-[11px] font-black italic tracking-tighter text-[#0079C1] -ml-1">P</span>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-500 dark:text-zinc-400 text-xs py-6 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Side: Copyright notice with links + Powered by */}
        <div className="space-y-1 text-left">
          <p>
            Copyright &copy; {currentYear}, Alexpoeima Art. All rights reserved. See our{" "}
            <Link href="/terms" className="hover:underline text-zinc-600 dark:text-zinc-300">
              terms of use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:underline text-zinc-600 dark:text-zinc-300">
              privacy notice
            </Link>.
          </p>
          <p>
            Powered by{" "}
            <a
              href="https://pradocommerce.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-zinc-600 dark:text-zinc-300"
            >
              Prado Commerce
            </a>
          </p>
        </div>

        {/* Right Side: Payment Card Icons */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <AmexIcon />
          <VisaIcon />
          <MastercardIcon />
          <PaypalIcon />
        </div>

      </div>
    </footer>
  );
}
