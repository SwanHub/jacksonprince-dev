import type { Metadata } from "next";
import Article, {
  A,
  Cmd,
  Code,
  CodeBlock,
  Divider,
  Figure,
  H2,
  H3,
  OL,
  P,
  TableOfContents,
  UL,
} from "../../components/Article";
import PageHeader from "../../components/PageHeader";
import PageShell from "../../components/PageShell";
import ShareLinks from "../../components/ShareLinks";
import BgRemover from "../../components/BgRemover";

export const metadata: Metadata = {
  title: "How to Build a Free HD Image Background Remover in 5 Minutes",
  description:
    "How to create your own HD image background remover that can be used for free 10 thousand times a month, using SAM3 and Roboflow.",
};

const toc = [
  { id: "intro", label: "Intro" },
  { id: "try-it", label: "Try the remover" },
  { id: "resources", label: "Resources" },
  { id: "step-1", label: "1. Next.js app" },
  { id: "step-2", label: "2. SAM3 Workflow" },
  { id: "step-3", label: "3. Connect & test" },
  { id: "step-4", label: "4. removeBg utility" },
  { id: "run-it", label: "Run it" },
  { id: "qa", label: "Q&A" },
];

export default function HowToBuildAFreeBackgroundRemover() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbTrail={[{ label: "writing", href: "/writing" }]}
        breadcrumb="how to build a free hd image background remover in 5 minutes"
        title="How to Build a Free HD Image Background Remover in 5 Minutes"
        subtitle={
          <div className="flex flex-col gap-3">
            <h2>Liberate your bitmaps</h2>
            <ShareLinks
              url="https://jacksonprince.dev/writing/how-to-build-a-free-hd-image-background-remover-in-5-minutes"
              title="How to Build a Free HD Image Background Remover in 5 Minutes"
            />
          </div>
        }
      />
      <div className="w-full max-w-3xl flex items-start">
        <TableOfContents items={toc} />
        <Article id="intro">
          <P>
            In this brief guide, I’ll teach you how to create your own HD image
            background remover that you can use 10 thousand times a month for
            free. All you need is{" "}
            <A href="https://ai.meta.com/research/sam3/">SAM3</A>,{" "}
            <A href="https://roboflow.com/">Roboflow</A> and 5 minutes.
          </P>
          <P>
            Behold Canva&apos;s <A href="https://www.remove.bg/">remove.bg</A>{" "}
            (compression) vs. our DIY tool (lossless):
          </P>
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783996905249-Group-181191.png"
            alt="Side-by-side cutouts of the same horse: remove.bg’s free tier at 408 × 612 pixels versus ours at the full 3333 × 5000"
            width={1012}
            height={637}
            expandable={false}
            priority
          />
          <P>Crisp.</P>
          <Divider />
          <H2 id="try-it">Try it yourself</H2>
          <P>Drop an image or select an example image to test it out.</P>
          <BgRemover />
          {/* <P>
            If you’re with me in that niche of all niches, looking for a{" "}
            <strong>free, lossless image background remover</strong>, then
            you’re in the right place. Welcome.
          </P> */}
          <H2 id="resources">Resources</H2>
          <P>Many of you may simply want the code.</P>
          <UL>
            <li>
              <A href="https://github.com/swanhub/bg-remover">Fork the code</A>{" "}
              + follow setup instructions in the README.
            </li>
            <li>
              Or tell your local AI agent to read and replicate this article.
            </li>
            <li>
              Watch me speedrun this project on{" "}
              <A href="https://youtube.com/">YouTube</A>.
            </li>
          </UL>
          <Divider />

          {/* <P>
            <strong>4 Simple Steps</strong>
          </P>
          <OL>
            <li>Create a Next.js web app</li>
            <li>Setup a SAM3 Workflow in Roboflow</li>
            <li>Connect the app to the workflow and test</li>
            <li>
              Apply a <Code>removeBg</Code> JS utility
            </li>
          </OL> */}

          {/* <Divider /> */}

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
            file="/app/page.tsx"
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
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783997078737-step_2.png"
            alt="The bare-bones form at localhost:3000 — a file input, a text input, and a Submit button"
            width={3374}
            height={2198}
          />
          <P>
            Truly beautiful. Your grandkids' grandkids will speak of this UI.
          </P>

          <Divider />

          <H2 id="step-2">Step 2: Setup SAM3 Workflow in Roboflow</H2>
          <P>
            Roboflow is the leading platform for all things computer vision.
          </P>
          <P>
            Of course, if you are positively allergic to signing up for free
            things, then you can request access to the model weights through
            HuggingFace and follow the setup instructions on the{" "}
            <A href="https://github.com/facebookresearch/sam3">SAM3 repo</A>.
          </P>
          <P>
            Otherwise, I would suggest easy mode: sign into Roboflow, build a
            workflow, hit “deploy”. That’s what we’ll do today.
          </P>
          <P>
            So <A href="https://app.roboflow.com/login">sign into Roboflow</A>.
          </P>
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783997086965-step_3.png"
            alt="The Roboflow sign-in page"
            width={3374}
            height={2198}
          />
          <P>
            Navigate to{" "}
            <A href="https://app.roboflow.com/workflows">Workflows</A>.
          </P>
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783997184994-step_4_1.png"
            alt="The Workflows section of the Roboflow dashboard"
            width={3374}
            height={2198}
          />
          <P>
            Select <Code>Browse Templates</Code> &gt;{" "}
            <Code>SAM3 with Prompts</Code>
          </P>
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783997569835-Group-181192.png"
            alt="Selecting Browse Templates, then the SAM3 with Prompts template"
            width={1619}
            height={1115}
          />
          <P>
            Try it out. Select “Preview” in the top right-hand corner, then drop
            in an image and a text prompt that describes the foreground object.
            For example, <Code>horse</Code>:
          </P>
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783997314854-step_4_3.png"
            alt="Workflow preview: SAM3’s mask rendered as a purple overlay on the horse, with the JSON output panel alongside"
            width={3374}
            height={2198}
          />
          <P>
            That purple hue outlining the horse is a pixel-perfect mask created
            by SAM3. It is predicting where the horse is in the image, then we
            use a Mask Visualization workflow block to render the mask on top of
            the original image.
          </P>
          <P>
            Hit <Code>Publish</Code> and you’re done. 🎉 You now have a live API
            endpoint that accepts an image and text, and returns the exact
            coordinates of whatever you describe, wherever it appears.
          </P>

          <Divider />

          <H2 id="step-3">Step 3: Connect Workflow to Website</H2>
          <P>
            To connect the workflow to your website, click the big purple Deploy
            button and copy the JavaScript fetch code. It includes the url to
            hit, as well as the POST body and your workspace API key:
          </P>
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783997680171-step_5_new.png"
            alt="The Deploy dialog with the JavaScript fetch snippet — endpoint URL, POST body, and API key"
            width={3374}
            height={2198}
          />
          <P>
            Create a new server-side route in your Nextjs app and paste in the
            JS fetch info:
          </P>
          <P>
            In <Code>app/api/infer/route.tsx</Code> write the server handler:
          </P>
          <CodeBlock
            file="app/api/infer/route.tsx"
            code={`export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  const prompts = formData.get("prompts") as String;

  const response = await fetch(
    "https://serverless.roboflow.com/{YOUR_WORKSPACE_URL}/workflows/{YOUR_WORKFLOW_SLUG}",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: API**********,
        inputs: {
          image: {
            type: "base64",
            value: Buffer.from(await image.arrayBuffer()).toString("base64"),
          },
          prompts: prompts.split(",").map((p) => p.trim()),
        },
      }),
    },
  );

  const result = await response.json();
  return Response.json(result, { status: response.status });
}`}
          />
          <P>
            Try it out! Select a file, type in <Code>horse</Code> (or whatever),
            and hit Submit. You should see a wall of JSON returned in a new tab{" "}
            <Code>localhost:3000/api/infer</Code>:
          </P>
          {/*  */}
          <P>That wall of JSON means it’s working 🎉</P>
          <P>
            Client is connected to server is connected to Roboflow and back.
            You’re getting pixel-perfect SAM3 predictions.
          </P>

          <Divider />

          <H2 id="step-4">
            Step 4: Apply a <Code>removeBg</Code> utility
          </H2>
          <P>
            Final step — we have the original image, we have SAM3’s mask
            predictions of wherever the objects are in the image. Now we need to
            layer the two on top of each other and make everything outside of
            SAM3’s predictions transparent.
          </P>
          <P>
            The “SAM3 predictions” object returned from Roboflow includes the
            dimensions of the original image, and an array of Run Length Encoded
            masks (<Code>RLEMask</Code>).
            <sup>
              <A href="#rle">[1]</A>
            </sup>
          </P>
          <P>
            Declare the shape of that incoming data in{" "}
            <Code>app/lib/types.ts</Code>:
          </P>
          <CodeBlock
            file="app/lib/types.ts"
            code={`export type Sam3Predictions = {
  image: { width: number; height: number };
  predictions: { rle_mask: RLEMask }[];
};

export type RLEMask = {
  size: [number, number];
  counts: string;
};`}
          />
          <P>
            Create a new utility file <Code>app/lib/removeBg.ts</Code> that
            holds our <Code>removeBg()</Code> orchestrator, which consists of
            three helper functions:
          </P>
          <UL>
            <li>
              <Code>buildMask()</Code>: Build a single, merged mask from all
              predictions returned by SAM3.
            </li>
            <li>
              <Code>applyMask()</Code>: Apply destination-in compositing tool to
              create our image cutout.
            </li>
            <li>
              <Code>encodePNG()</Code>: Encode that cutout as PNG to retain
              transparency.
            </li>
          </UL>
          <P>
            Write the orchestrator in <Code>app/lib/removeBg.ts</Code>:
          </P>
          <CodeBlock
            file="app/lib/removeBg.ts"
            code={`export async function removeBg(
  image: File,
  predictions: Sam3Predictions,
): Promise<Blob> {
  const mask = buildMask(predictions);
  const cutout = await applyMask(image, mask);
  return encodePNG(cutout);
}`}
          />
          <P>Let’s walk through each helper function, one by one.</P>

          <H3>
            Step 1: <Code>buildMask()</Code>
          </H3>
          <P>
            Create a base canvas element that is the size of the original image,
            then decode and draw each SAM3 mask onto it.
          </P>
          <P>
            In <Code>app/lib/removeBg.ts</Code> write:
          </P>
          <CodeBlock
            file="app/lib/removeBg.ts"
            code={`function buildMask({ image, predictions }: Sam3Predictions): HTMLCanvasElement {
  const mask = document.createElement("canvas");
  mask.width = image.width;
  mask.height = image.height;
  const ctx = mask.getContext("2d")!;

  for (const { rle_mask } of predictions) {
    const layer = document.createElement("canvas");
    layer.width = mask.width;
    layer.height = mask.height;
    layer.getContext("2d")!.putImageData(decodeRLEMask(rle_mask), 0, 0);
    ctx.drawImage(layer, 0, 0);
  }
  return mask;
}`}
          />
          <P>
            The “decode” step (<Code>decodeRLEMask</Code>) needs its own
            dedicated file. Create a new utility file{" "}
            <Code>app/lib/decodeRLEMask.ts</Code> and port in the RLE Mask
            decoder logic from pycocotools.
          </P>
          <P>
            In <Code>app/lib/decodeRLEMask.ts</Code> write:
          </P>
          <CodeBlock
            file="app/lib/decodeRLEMask.ts"
            code={`function decodeRLECounts(encoded: string): number[] {
  const counts: number[] = [];
  let p = 0;
  while (p < encoded.length) {
    let x = 0;
    let k = 0;
    let more = true;
    while (more) {
      const c = encoded.charCodeAt(p++) - 48;
      x |= (c & 0x1f) << (5 * k);
      more = (c & 0x20) !== 0;
      k++;
      if (!more && c & 0x10) x |= -1 << (5 * k);
    }
    if (counts.length > 2) x += counts[counts.length - 2];
    counts.push(x);
  }
  return counts;
}

export function decodeRLEMask({
  size: [height, width],
  counts,
}: RLEMask): ImageData {
  const mask = new ImageData(width, height);
  let pixel = 0;
  let inside = false;
  for (const run of decodeRLECounts(counts)) {
    if (inside) {
      for (let i = pixel; i < pixel + run; i++) {
        const row = i % height;
        const col = (i - row) / height;
        mask.data[(row * width + col) * 4 + 3] = 255;
      }
    }
    pixel += run;
    inside = !inside;
  }
  return mask;
}`}
          />
          <P>
            That’s a lot of jargon! To learn more about what is happening right
            there, read the <A href="#rle">Run Length Encoding section</A> in
            the Questions and Answers Epilogue. That question comes with a
            visualizer that breaks down the decode / encode process step by
            step.
          </P>

          <H3>
            Step 2: <Code>applyMask()</Code>
          </H3>
          <P>
            In this step, we take the merged mask built in{" "}
            <Code>buildMask()</Code>, and lay it flat on top of our original
            image, then perform a destination-in cutout using Canvas API.
          </P>
          <P>
            In <Code>app/lib/removeBg.ts</Code> write:
          </P>
          <CodeBlock
            file="app/lib/removeBg.ts"
            code={`async function applyMask(
  image: File,
  mask: HTMLCanvasElement,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = mask.width;
  canvas.height = mask.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(await createImageBitmap(image), 0, 0, mask.width, mask.height);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(mask, 0, 0);
  return canvas;
}`}
          />
          <P>
            To visualize and play around with the destination-in compositing
            tool, try the{" "}
            <A href="https://www.w3schools.com/tags/canvas_globalcompositeoperation.asp">
              destination-in interactive demo on W3Schools
            </A>
            .
          </P>

          <H3>
            Step 3: <Code>encodePNG()</Code>
          </H3>
          <P>
            Last and easiest step: make sure the image you just created is
            encoded as a PNG to retain alpha channels (transparency).
          </P>
          <P>
            In <Code>app/lib/removeBg.ts</Code> write:
          </P>
          <CodeBlock
            file="app/lib/removeBg.ts"
            code={`function encodePNG(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Failed to encode PNG.")),
      "image/png",
    ),
  );
}`}
          />

          <Divider />

          <H2 id="run-it">▶️ Run it</H2>
          <P>You have everything you need:</P>
          <OL>
            <li>Web app to select and send an image</li>
            <li>SAM3 API to segment out objects</li>
            <li>Utility function to create the PNG cutout</li>
          </OL>
          <P>
            Select an image, add in a text prompt to describe the focal point of
            the image, and voilà:
          </P>
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783996671498-CleanShot-2026-07-13-at-14.13.47-2x.png"
            alt="The finished tool with horse.jpg and the prompt “horse” — the original photo beside its transparent cutout, with a Download button"
            width={3210}
            height={2190}
          />
          <Figure
            src="https://fkysszwiasduklapfzoe.supabase.co/storage/v1/object/public/jp-site-media/1783996713218-CleanShot-2026-07-13-at-14.13.33-2x.png"
            alt="The finished tool with donut.jpg and the prompt “donut” — every donut in the photo cut out onto a transparent background"
            width={3210}
            height={2190}
          />
          <P>
            Hopefully you find a bit of use in this tool. I went ahead and
            applied some basic styling and reactivity.
          </P>

          <Divider />

          <H2 id="qa">Questions and Answers</H2>
          <P>
            These are all questions I asked and found the answer for while
            writing this article.
          </P>

          <H3 id="rle">[1] What is Run Length Encoding?</H3>
          <P>
            Run Length Encoding (RLE) is converting the sequence{" "}
            <Code>AAABBCCCCC</Code> – 3 A’s followed by 2 B’s, followed by 5 C’s
            – to a shorter notation <Code>3A2B5C</Code>, read as “3 A’s, 2 B’s,
            5 C’s”.
          </P>
          <P>
            RLE is a great way to encode masks, because a mask is made up of
            only two values: transparent (Alpha channel = 0) or opaque (Alpha
            channel = 1). You don’t need to specify that a count refers to a run
            of 0’s or a run of 1’s. You just assume you’re flipping back and
            forth between 0’s and 1’s. As a result, the string{" "}
            <Code>00011100000</Code> can be written as <Code>335</Code>, or “3
            0’s, 3 1’s, 5 0’s”.
          </P>
          <P>
            In the <Code>rle_mask</Code> value we get back from SAM3, there is
            even one more level of compression that packs our runs even more
            tightly, so you can go from <Code>335</Code> to just{" "}
            <Code>&gt;</Code> for example. But that step is outside the scope of
            this article (read more here). The core insight is that{" "}
            <Code>rle_mask</Code> returns a sequence representing “runs” of 0’s
            (transparent) and 1’s (opaque), which, when painted in a grid of a
            certain size, creates a mask.
          </P>
          <P>Visualize RLE mask decoding on a 16x16 grid:</P>
          {/* Interactive placeholder: RLE mask decoding visualizer (16x16 grid) */}

          <H3>[2] How do we “make pixels transparent”?</H3>
          <P>
            This is simpler than I thought it would be. RGBA is a color space
            that includes Red, Green, Blue, and Alpha, where Alpha represents a
            color’s transparency. It scales from 0 to 1, where 0 is fully
            transparent, and 1 is fully opaque. In our <Code>removeBg()</Code>{" "}
            utility above, we set all pixels to an Alpha channel value of 0 to
            make them transparent.
          </P>

          <H3>[3] How does “transparency” work?</H3>
          <P>
            If a color’s Alpha channel is 0.5, then the final displayed color is
            calculated as:
          </P>
          <P>
            <em>50% of the color, plus 50% of whatever is below it</em>
          </P>
          <P>
            Concretely, if the top RGB layer is <Code>[255,255,255,0.5]</Code>{" "}
            (white, 50% transparency) and the layer beneath is{" "}
            <Code>[0,0,0,1]</Code> (black), then the resulting color is:
          </P>
          <CodeBlock
            code={`R = (0.5 × 255) + (0.5 × 0) = 127.5
G = (0.5 × 255) + (0.5 × 0) = 127.5
B = (0.5 × 255) + (0.5 × 0) = 127.5`}
          />
          <P>
            That is, roughly: <Code>[128, 128, 128]</Code>, or “gray”.
          </P>
        </Article>
      </div>
    </PageShell>
  );
}
