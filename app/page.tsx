import HomeClient from "./HomeClient";
import { getDoodles } from "@/lib/doodles";

// Re-fetch the doodle list from Supabase at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const doodles = await getDoodles();
  return <HomeClient doodles={doodles} />;
}
