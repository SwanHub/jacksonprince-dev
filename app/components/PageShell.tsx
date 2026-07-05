export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full flex flex-col items-center px-6 pt-12 pb-28 gap-6">
      {children}
    </main>
  );
}
