import { Reveal } from "./Reveal";
import { MomentsStack, type Moment } from "./MomentsStack";

const MOMENTS: Moment[] = [
  {
    src: "/brand/moments/01.jpg",
    alt: "Raissa at dusk on a velvet sofa, draped in a faux-fur coat",
    vol: "I",
    tag: "After hours",
  },
  {
    src: "/brand/moments/02.jpg",
    alt: "Raissa on a bouclé chair with framed art behind",
    vol: "II",
    tag: "Between takes",
  },
  {
    src: "/brand/moments/03.jpg",
    alt: "Raissa beside a botanical wall in red and white",
    vol: "III",
    tag: "Off the record",
  },
  {
    src: "/brand/moments/04.jpg",
    alt: "Raissa against pleated velvet in soft plum light",
    vol: "IV",
    tag: "Quiet hours",
  },
];

export function MomentsSection() {
  return (
    <section className="relative bg-ink">
      <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left — editorial masthead */}
          <Reveal className="lg:col-span-5">
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold/90">
              Vol. I — IV
            </p>
            <span aria-hidden className="mt-5 block h-px w-12 bg-gold/60" />
            <h2 className="mt-7 break-words font-display text-[44px] leading-[1.0] tracking-[-0.015em] text-paper sm:text-[56px] lg:text-[72px]">
              Off
              <span className="italic font-light text-sub"> the mic.</span>
            </h2>
            <p className="mt-6 max-w-md font-body text-[18px] italic leading-[1.55] text-sub">
              A few frames from the spaces between conversations.
            </p>
          </Reveal>

          {/* Right — polaroid stack */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="flex items-center justify-center py-6 lg:py-0">
              <MomentsStack moments={MOMENTS} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
