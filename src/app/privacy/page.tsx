import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Deep Dives handles your information when you sign up for the newsletter, send a message, or watch episodes.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "May 16, 2026";

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl() },
          { name: "Privacy", url: `${siteUrl()}/privacy` },
        ])}
      />
      <Header />
      <main>
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-32 lg:px-10 lg:py-40">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-7">
                <h1 className="break-words font-display text-[44px] leading-[1.0] tracking-[-0.015em] sm:text-[64px] sm:leading-[0.96] lg:text-[96px]">
                  <DropCap letter="P" />rivacy
                  <span className="italic font-light text-sub"> Policy.</span>
                  <span className="clear-both block" />
                </h1>
                <p className="mt-6 font-body italic text-sub text-[14px]">
                  Last updated {LAST_UPDATED}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Short version: we only collect what you give us, we don't sell it, and you can
                  ask us to delete it anytime.
                </p>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-20 lg:px-10 lg:py-28">
            <Reveal className="mx-auto max-w-3xl space-y-14">
              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  What we collect
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  Deep Dives only collects information you actively give us, primarily your email
                  address when you subscribe to the newsletter, and whatever you write into the
                  contact form (name, email, message, subject).
                </p>
                <p className="mt-4 font-body text-sub text-[18px] leading-[1.7]">
                  We do not run third-party analytics or behavioral tracking on this site. No
                  cookies are set for advertising purposes. Embedded YouTube videos may set their
                  own cookies under Google's policies, separate from ours.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  How we use it
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  Email addresses from the newsletter signup are used solely to send updates about
                  new episodes and occasional behind-the-scenes notes from Raissa. Messages sent
                  through the contact form are read and replied to by the Deep Dives team. They
                  are not used for marketing.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Who we share it with
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  We don't sell, rent, or trade your personal information to anyone. We do use a
                  small number of trusted service providers to operate the site (content hosting,
                  email delivery), and they only ever see what's necessary to do their job.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Your choices
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  You can unsubscribe from the newsletter anytime using the link in any email we
                  send. To request a copy of your data, or to ask us to delete it entirely, write
                  to us via the{" "}
                  <a href="/contact" className="text-gold underline-offset-4 hover:underline">
                    contact form
                  </a>{" "}
                  and we will respond promptly.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Children
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  This site is not directed at children under 13. We do not knowingly collect
                  information from children. If you believe a child has provided us with personal
                  information, contact us and we will remove it.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Changes to this policy
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  We may update this policy from time to time. Any material change will be reflected
                  in the "Last updated" date above. Continued use of the site after a change means
                  you accept the updated policy.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
