type PageTitleProps = {
  title: string;
  description?: string;
};

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
    </div>
  );
}
