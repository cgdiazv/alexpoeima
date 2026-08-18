"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isRegister && password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister 
      ? { email, password, firstName, lastName } 
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Authentication failed");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "There was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        {/* Toggle Mode Buttons */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg("");
            }}
            className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors border-b-2 ${
              !isRegister
                ? "border-black text-zinc-900 dark:border-white dark:text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg("");
            }}
            className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors border-b-2 ${
              isRegister
                ? "border-black text-zinc-900 dark:border-white dark:text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            Register
          </button>
        </div>

        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {isRegister ? "Create an Account" : "Sign In"}
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {isRegister
              ? "Enter your details below to create a new customer account."
              : "Enter your email and password to sign in."}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-sm rounded bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="first-name" className="sr-only">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required={isRegister}
                    className="relative block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="sr-only">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    required={isRegister}
                    className="relative block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegister && (
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required={isRegister}
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-black px-3 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {loading
                ? "Processing..."
                : isRegister
                ? "Create Account"
                : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
