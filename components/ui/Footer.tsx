import Link from "next/link";

function AmexIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-[#006FCF] flex items-center justify-center flex-shrink-0 text-white font-black text-[9px] tracking-tighter select-none">
      AMEX
    </div>
  );
}

function ApplePayIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center flex-shrink-0 select-none">
      <svg className="h-3 w-auto text-black" viewBox="0 0 170 170" fill="currentColor">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.01.12-9.87-1.93-14.58-6.14-3.13-2.75-6.97-7.39-11.53-13.94-6.42-9.23-11.45-19.68-15.08-31.33-3.63-11.66-5.45-22.99-5.45-34 0-14.8 3.73-27.18 11.2-37.13 7.46-9.95 16.92-15.04 28.37-15.27 4.69 0 9.87 1.16 15.54 3.47 5.68 2.32 9.54 3.48 11.58 3.48 1.83 0 5.8-1.22 11.91-3.66 6.11-2.44 11.41-3.56 15.91-3.36 12.01.92 21.6 5.48 28.77 13.68-10.74 6.52-16.01 15.74-15.8 27.67.21 9.4 3.86 17.15 10.95 23.25 7.1 6.1 15.51 9.49 25.24 10.17-2.35 6.94-5.32 13.91-8.91 20.91zM119.22 31.84c0-7.36 2.68-14.43 8.04-21.22 5.36-6.79 12.18-10.62 20.46-11.49.12 1.05.18 1.93.18 2.63 0 7.37-2.74 14.53-8.23 21.49-5.48 6.96-12.35 10.82-20.61 11.58-.04-.84-.1-1.84-.1-2.99z"/>
      </svg>
      <span className="text-[10px] font-semibold text-black ml-0.5">Pay</span>
    </div>
  );
}

function DinersIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center flex-shrink-0 select-none">
      <svg className="h-3.5 w-auto text-[#004A97]" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"/>
        <path d="M50 10 A40 40 0 0 0 50 90 Z"/>
      </svg>
    </div>
  );
}

function DiscoverIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center flex-shrink-0 px-0.5 select-none">
      <span className="text-[7px] font-black tracking-tighter text-zinc-800">DISC</span>
      <span className="w-2 h-2 rounded-full bg-[#F47216] mx-[0.5px]"></span>
      <span className="text-[7px] font-black tracking-tighter text-zinc-800">VER</span>
    </div>
  );
}

function GPayIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center flex-shrink-0 select-none px-1">
      <span className="text-[10px] font-bold text-[#4285F4]">G</span>
      <span className="text-[10px] font-medium text-zinc-700 ml-0.5">Pay</span>
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

function ShopPayIcon() {
  return (
    <div className="h-6 w-9 rounded border border-zinc-200 dark:border-zinc-700 bg-[#5A31F4] flex items-center justify-center flex-shrink-0 select-none">
      <span className="text-[9px] font-extrabold text-white tracking-tight">shop</span>
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

        {/* Right Side: Sleek Payment Card Icons */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <AmexIcon />
          <ApplePayIcon />
          <DinersIcon />
          <DiscoverIcon />
          <GPayIcon />
          <MastercardIcon />
          <PaypalIcon />
          <ShopPayIcon />
          <VisaIcon />
        </div>

      </div>
    </footer>
  );
}
