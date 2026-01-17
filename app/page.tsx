export default function Home() {
  return (
    <main className="p-4 sm:p-12 w-full flex flex-col justify-center items-center">
      <header className="pb-8 max-w-xl text-left w-full">
        <h1 className="text-3xl font-(family-name:--font-instrument-serif)">
          Jackson Prince
        </h1>
        <nav className="flex gap-2 text-zinc-500 text-xs mt-1">
          <span>NY</span>
          <span>·</span>
          <a
            href="https://linkedin.com/in/jackson-prince"
            className="hover:underline text-[#0a66c2]"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <span>·</span>
          <a
            href="https://github.com/SwanHub"
            className="text-[#0FBF3E] hover:underline"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <article className="text-sm pb-8 text-left space-y-4 max-w-xl w-full">
        <p>Welcome to my website!</p>
        <p>
          I live in New York, code at{" "}
          <a
            href="https://roboflow.com"
            className="text-violet-700 hover:underline"
            rel="noopener noreferrer"
          >
            Roboflow
          </a>{" "}
          and run{" "}
          <a
            href="https://frame240.com"
            className="text-red-800 hover:underline"
            rel="noopener noreferrer"
          >
            Frame 240
          </a>
          .
        </p>
        <p>
          I enjoy writing, doodling, running and acting. Come to my next play
          reading with the{" "}
          <a
            href="https://momath.org/civicrm/event/info/?reset=1&id=11725"
            className="text-[#d5af60] hover:underline"
            rel="noopener noreferrer"
          >
            Museum of Mathematics on February 23rd
          </a>{" "}
          (free, virtual).
        </p>
        <p>A few unusual facts:</p>
        <ul className="ml-4 space-y-1">
          <li className="list-disc">
            Published a coffee table book that won a Canadian Print Award
          </li>
          <li className="list-disc">
            Sold an art sharing app with 100k+ posts
          </li>
          <li className="list-disc">Acted as a mathematician Off-Broadway</li>
          <li className="list-disc">
            Produced a documentary now on Amazon Prime
          </li>
          <li className="list-disc">
            Lived in SF, Austin, Denver before finding loml in BK
          </li>
        </ul>
      </article>

      <section
        className="flex flex-col gap-1 max-w-xl justify-start w-full"
        aria-label="Doodle Gallery"
      >
        <img
          src="/doodle_2.JPG"
          alt="Doodle artwork"
          className="border-2 border-zinc-200"
        />
        <img
          src="/doodle_3.JPG"
          alt="Doodle artwork"
          className="border-2 border-zinc-200"
        />
        <img
          src="/doodle_1.JPG"
          alt="Doodle artwork"
          className="border-2 border-zinc-200"
        />
      </section>
    </main>
  );
}
