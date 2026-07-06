import Breadcrumbs from "./Breadcrumbs";

export default function PageHeader({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: React.ReactNode;
  breadcrumb?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 w-full border-b border-dashed max-w-3xl pb-12 border-b-zinc-200">
      <Breadcrumbs current={breadcrumb} />
      <h1 className="mt-8 text-2xl sm:text-3xl leading-tight">{title}</h1>
      {typeof subtitle === "string" ? <h2>{subtitle}</h2> : subtitle}
    </div>
  );
}
