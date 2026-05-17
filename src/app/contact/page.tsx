import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact — Deep Dive Podcast with Raissa",
  description:
    "Write to Deep Dives. Guest pitches, press inquiries, partnerships, or just hello.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-32 lg:px-10 lg:py-40">
            {/* Masthead */}
            <div className="mb-20 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                  Get in touch
                </p>
                <h1 className="mt-5 font-display text-[64px] leading-[0.96] tracking-[-0.015em] lg:text-[96px]">
                  Write to <span className="italic font-light text-sub">Deep Dives.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1} className="self-end lg:col-span-4 lg:col-start-9">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Guest pitches, press, partnerships, or just a note about an episode that landed.
                  Every message gets read.
                </p>
              </Reveal>
            </div>

            {/* Two-column body */}
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left — context column */}
              <Reveal className="lg:col-span-5">
                <div className="border-t border-rule pt-10">
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    Pitching a guest?
                  </p>
                  <p className="mt-5 font-body text-paper text-[18px] leading-[1.6]">
                    Deep Dives runs long-form interviews with people whose stories don't fit a
                    tweet. Founders past the pitch deck, planners past the photo shoot, clergy past
                    the Sunday cadence. If that sounds like you, tell us the story you'd tell on
                    mic.
                  </p>
                </div>

                <div className="mt-12 border-t border-rule pt-10">
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    Press &amp; partnerships
                  </p>
                  <p className="mt-5 font-body text-paper text-[18px] leading-[1.6]">
                    Working on a piece about the show or interested in collaborating? Drop a line
                    and we'll route it to the right inbox.
                  </p>
                </div>

                <div className="mt-12 border-t border-rule pt-10">
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    Or just say hi
                  </p>
                  <p className="mt-5 font-body italic text-sub text-[18px] leading-[1.55]">
                    The best notes start with which episode pulled you in.
                  </p>
                </div>
              </Reveal>

              {/* Right — form */}
              <Reveal delay={0.12} className="lg:col-span-7">
                <ContactForm />
              </Reveal>
            </div>
          </div>

          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
