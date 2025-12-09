import { useState } from "react";
import beforeImage from "@/assets/before-bathroom.jpg";
import afterImage from "@/assets/after-bathroom.jpg";

const BeforeAfterSection = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section className="section-padding bg-foreground text-background">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Prije i Poslije
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-background">
            Pogledajte transformaciju
          </h2>
          <p className="mt-4 text-lg text-background/70">
            Pravi rezultati naših klijenata. Povucite slider da vidite razliku.
          </p>
        </div>

        {/* Before/After Slider */}
        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-floating">
          <div className="relative aspect-[4/3] w-full">
            {/* After Image (Background) */}
            <img
              src={afterImage}
              alt="Renovirana kupaonica"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt="Kupaonica prije renovacije"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-background shadow-lg z-10"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background shadow-elevated flex items-center justify-center">
                <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 px-4 py-2 bg-foreground/90 text-background rounded-lg text-sm font-semibold">
              Prije
            </div>
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">
              Poslije
            </div>

            {/* Range Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { value: "100+", label: "Zadovoljnih klijenata" },
            { value: "98%", label: "Završeno na vrijeme" },
            { value: "4.9", label: "Prosječna ocjena" },
            { value: "20+", label: "Godina iskustva" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-background/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
