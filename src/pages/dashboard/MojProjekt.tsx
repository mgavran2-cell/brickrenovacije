import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data until full project tables exist
const project = {
  title: "Kompletna renovacija stana",
  address: "Ozaliska 34",
  type: "Kompletna",
  area: 68,
  progress: 42,
  startDate: "6. listopada",
  endDate: "2. prosinca 2026.",
  initialMonth: "Listopad",
};

const currentTasks = [
  { name: "Elektroinstalacije", percent: 80, contractor: "Elektro Horvat", status: "završetak u srijedu" },
  { name: "Vodoinstalacije, kupaonica", percent: 60, contractor: "Tim Brick", status: "kontrola u četvrtak" },
  { name: "Poravnavanje zidova, dnevni boravak", percent: 35, contractor: "Tim Brick", status: "" },
  { name: "Hidroizolacija kupaonice", percent: 0, contractor: "Tim Brick", status: "Kreće u utorak" },
];

const next7Days = [
  { dayShort: "PON", date: "26", task: "Završni razvod struje", detail: "Kuhinja i hodnik" },
  { dayShort: "UTO", date: "27", task: "Hidroizolacija kupaonice", detail: "Prvi sloj, sušenje 24 h" },
  { dayShort: "SRI", date: "28", task: "Isporuka pločica", detail: "8–10 h · potreban pristup stanu", requiresPresence: true },
  { dayShort: "ČET", date: "29", task: "Kontrola vodoinstalacija", detail: "Marko na gradilištu od 9 h" },
  { dayShort: "PET", date: "30", task: "Gletanje, prvi sloj", detail: "Dnevni boravak" },
  { dayShort: "SUB", date: "31", task: null, detail: "Bez radova" },
  { dayShort: "NED", date: "1", task: null, detail: "Blagdan, Svi sveti" },
];

const weeks = ["Tjedan 1", "Tjedan 2", "Tjedan 3"];
const photos = ["Zaštita podova i stolarije", "Demontaža kuhinje", "Rušenje pregradnog zida", "Odvoz šute"];

const card = "bg-dash-card rounded-2xl p-8 border border-dash-border mb-10";

const MojProjekt = () => {
  const [activeWeek, setActiveWeek] = useState(weeks[0]);

  return (
    <div className="max-w-5xl p-6 md:p-10 bg-dash-bg">
      <div className="mb-10">
        <p className="text-sm text-dash-subtle mb-3 font-dashboard">Moj projekt</p>
        <h1 className="text-4xl md:text-6xl font-serif font-normal leading-tight">{project.title}</h1>
      </div>

      <div className="bg-dash-border rounded-2xl mb-10 aspect-[2/1] relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="mx-auto mb-2 text-dash-faint" size={32} />
          <p className="text-dash-subtle font-dashboard">Fotografija stana prije radova</p>
          <button className="text-sm text-primary underline mt-2 font-dashboard">ili odaberite datoteku</button>
        </div>
        <div className="absolute top-6 left-6 bg-dash-ink text-primary-foreground rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-dashboard">
          Prije · {project.initialMonth}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        {[
          ["Adresa", project.address],
          ["Tip radova", project.type],
          ["Površina", `${project.area} m²`],
        ].map(([l, v]) => (
          <div key={l}>
            <p className="text-sm text-dash-subtle mb-2 font-dashboard">{l}</p>
            <p className="text-xl font-serif font-normal">{v}</p>
          </div>
        ))}
      </div>

      <div className={card}>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-3xl font-serif font-normal">Dovršenost</h2>
          <span className="text-5xl font-serif font-normal text-primary">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-dash-soft rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
        </div>
        <div className="flex justify-between mt-5 text-sm text-dash-subtle font-dashboard">
          <span>Početak radova · {project.startDate}</span>
          <span>Predaja · {project.endDate}</span>
        </div>
      </div>

      <div className={card}>
        <h2 className="text-2xl font-serif font-normal mb-6">Trenutno u izvođenju</h2>
        {currentTasks.map((t) => (
          <div key={t.name} className="py-5 border-b border-dash-soft last:border-0">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium font-dashboard">{t.name}</p>
              <span className="text-sm text-dash-subtle font-dashboard">{t.percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-dash-soft rounded-full overflow-hidden">
              <div className="h-full bg-dash-ink rounded-full" style={{ width: `${t.percent}%` }} />
            </div>
            <p className="text-sm text-dash-subtle mt-2 font-dashboard">
              {t.contractor}{t.status ? ` · ${t.status}` : ""}
            </p>
          </div>
        ))}
      </div>

      <div className={card}>
        <h2 className="text-2xl font-serif font-normal mb-6">Sljedećih 7 dana</h2>
        {next7Days.map((d) => (
          <div key={d.date} className="flex gap-6 py-5 border-b border-dash-soft last:border-0">
            <div className="w-14 shrink-0 text-center">
              <p className="text-xs uppercase text-dash-subtle font-dashboard tracking-wider">{d.dayShort}</p>
              <p className="text-3xl font-serif font-normal mt-1">{d.date}</p>
            </div>
            <div className="flex-1">
              <p className="font-medium font-dashboard">{d.task || "Bez radova"}</p>
              <p className="text-sm text-dash-subtle font-dashboard mt-1">{d.detail}</p>
            </div>
            {d.requiresPresence && (
              <div className="bg-dash-hover rounded-full px-4 py-1.5 text-xs text-primary font-medium font-dashboard self-start">
                Vaša prisutnost
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-dash-card rounded-2xl p-8 border border-dash-border">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-2">
          <h2 className="text-2xl font-serif font-normal">Napredak s gradilišta</h2>
          <div className="flex gap-2">
            {weeks.map((w) => (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className={cn(
                  "px-4 py-1.5 text-sm font-dashboard rounded-lg",
                  activeWeek === w ? "bg-dash-card border border-dash-border" : "text-dash-subtle"
                )}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-dash-subtle mb-6 font-dashboard">6. – 12. listopada</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {photos.map((title) => (
            <div key={title}>
              <div className="aspect-[4/3] bg-dash-border rounded-xl border-2 border-dashed border-dash-line flex flex-col items-center justify-center">
                <ImageIcon className="text-dash-faint mb-2" size={24} />
                <p className="text-sm text-dash-subtle font-dashboard">Fotografija: {title}</p>
                <button className="text-xs text-primary underline mt-1 font-dashboard">ili odaberite datoteku</button>
              </div>
              <p className="text-sm font-dashboard mt-2">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MojProjekt;
