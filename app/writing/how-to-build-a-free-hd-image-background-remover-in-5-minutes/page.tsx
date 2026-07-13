import type { Metadata } from "next";
import Article, {
  A,
  Cmd,
  Code,
  CodeBlock,
  Divider,
  H2,
  OL,
  P,
  TableOfContents,
  UL,
} from "../../components/Article";
import PageHeader from "../../components/PageHeader";
import PageShell from "../../components/PageShell";

export const metadata: Metadata = {
  title: "How to Build a Free HD Image Background Remover in 5 Minutes",
  description:
    "How to create your own HD image background remover that can be used for free 10 thousand times a month, using SAM3 and Roboflow.",
};

const toc = [
  { id: "intro", label: "Intro" },
  { id: "try-it", label: "Try the remover" },
  { id: "step-1", label: "1. Next.js app" },
];

export default function HowToBuildAFreeBackgroundRemover() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbTrail={[{ label: "writing", href: "/writing" }]}
        breadcrumb="how to build a free hd image background remover in 5 minutes"
        title="How to Build a Free HD Image Background Remover in 5 Minutes"
        subtitle="A straightforward guide to creating your own high-res remove.bg in 5 minutes"
      />
      <div className="w-full max-w-3xl flex items-start">
        <TableOfContents items={toc} />
        <Article id="intro">
          <P>
            In this brief guide, I’ll teach you how to create your own HD image
            background remover that can be used for free 10 thousand times a
            month. All you need is{" "}
            <A href="https://ai.meta.com/research/sam3/">SAM3</A>,{" "}
            <A href="https://roboflow.com/">Roboflow</A> and 5 minutes.
          </P>
          <P>
            Behold the difference between the free tier on{" "}
            <A href="https://www.remove.bg/">remove.bg</A> and our free tool
            today:
          </P>
          {/* Comparison images coming next. */}
          <H2 id="try-it">Try it now</H2>
          <P>Note: I save uploads and display them in a gallery.</P>
          <P>
            If you’re with me in that niche of all niches, looking for a{" "}
            <strong>free, lossless image background remover</strong>, then
            you’re in the right place. Welcome.
          </P>
          <P>
            <strong>Resources</strong>
          </P>
          <UL>
            <li>
              <A href="https://github.com/swanhub/bg-remover">Fork the code</A>{" "}
              + follow setup instructions in the README.
            </li>
            <li>
              You can also watch me speedrun this project on{" "}
              <A href="https://youtube.com/">YouTube</A>.
            </li>
          </UL>
          <Divider />

          <P>
            <strong>4 Simple Steps</strong>
          </P>
          <OL>
            <li>Create a Next.js web app</li>
            <li>Setup a SAM3 Workflow in Roboflow</li>
            <li>Connect the app to the workflow and test</li>
            <li>
              Apply a <Code>removeBg</Code> JS utility
            </li>
          </OL>

          <Divider />

          <H2 id="step-1">Step 1: Create a simple Next.js web app</H2>
          <P>Create a brand new Nextjs app:</P>
          <Cmd>npx create-next-app@latest hd-background-remover</Cmd>
          <P>Navigate to the new project:</P>
          <Cmd>cd hd-background-remover</Cmd>
          <P>
            Replace the boilerplate code in <Code>/app/page.tsx</Code> with an
            input form that takes in:
          </P>
          <CodeBlock
            code={`export default function Home() {
  return (
    <div className="flex flex-col grow items-center justify-center">
      <form
        action="/api/infer"
        method="post"
        encType="multipart/form-data"
        className="flex flex-col items-center gap-1"
      >
        <input type="file" name="image" accept="image/*" className="border" />
        <input type="text" name="prompts" className="border" />
        <button type="submit" className="border">
          Submit
        </button>
      </form>
    </div>
  );
}`}
          />
          <P>Spin up the website locally:</P>
          <Cmd>npm run dev</Cmd>
          <P>
            What that looks like at <Code>http://localhost:3000</Code>
          </P>
          {/* Image placeholder: localhost screenshot */}
          <P>
            No need for fancy UI; this’ll do. Two input boxes and a form submit.
            Golden.
          </P>

          <Divider />
        </Article>
      </div>
    </PageShell>
  );
}
