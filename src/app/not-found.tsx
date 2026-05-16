import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Not Found — Deep Dive Podcast with Raissa",
  description: "The page you were looking for isn't here.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative">
          <div className="mx-auto grid min-h-[70vh] max-w-[1400px] place-items-center px-8 py-32 lg:px-10">
            <div className="text-center">
              <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                404
              </p>
              <h1 className="mt-6 font-display text-[64px] leading-[0.96] tracking-[-0.015em] lg:text-[112px]">
                Not <span className="italic font-light text-sub">here.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                This page either moved, never existed, or the link that brought you here is older
                than the conversation it was looking for.
              </p>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
                >
                  Back Home
                  <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href="/episodes"
                  className="inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold transition-colors duration-200 hover:bg-gold/10"
                >
                  Browse Episodes
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
