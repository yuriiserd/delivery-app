import { Analytics } from "@vercel/analytics/react";

export default function Layout({ children }: { children: React.ReactNode}): JSX.Element {
  return (
    <>
      <header className="w-full p-4 bg-orange-950 text-white">
        <h1 className="text-2xl">Delivery Routes</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
      <Analytics/>
    </>
  )
}