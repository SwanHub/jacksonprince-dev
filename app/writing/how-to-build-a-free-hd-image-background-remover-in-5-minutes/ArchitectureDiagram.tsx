type Zone = "browser" | "server" | "roboflow";

type Step = {
  zone: Zone;
  name: string;
  desc: string;
  arrow?: string; // label on the arrow leading to the next step
};

const ZONE_CHIP: Record<Zone, string> = {
  browser: "border-sky-200 text-sky-600",
  server: "border-zinc-300 text-zinc-600",
  roboflow: "border-purple-200 text-purple-600",
};

const STEPS: Step[] = [
  {
    zone: "browser",
    name: "/",
    desc: "single web page: input image and prompt",
  },
  {
    zone: "server",
    name: "/api/infer",
    desc: "forwards request to Roboflow",
  },
  {
    zone: "roboflow",
    name: "SAM3 Workflow",
    desc: "predicts masks of subject",
  },
  {
    zone: "browser",
    name: "removeBg()",
    desc: "applies transparency",
  },
];

export default function ArchitectureDiagram() {
  return (
    <ol className="w-full flex flex-col list-none rounded-md border border-zinc-100 bg-zinc-50 p-4 font-mono">
      {STEPS.map((step, i) => (
        <li key={step.name} className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-zinc-200 bg-white px-3 py-2">
            <span
              className={`w-20 shrink-0 rounded border px-1.5 py-0.5 text-center text-[10px] ${ZONE_CHIP[step.zone]}`}
            >
              {step.zone}
            </span>
            <code className="text-sm text-zinc-800">{step.name}</code>
            <span className="text-xs text-zinc-500">{step.desc}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              aria-hidden
              className="flex items-center gap-2 py-1.5 pl-10 text-xs text-zinc-400"
            >
              <span>↓</span>
              {step.arrow && <span>{step.arrow}</span>}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
