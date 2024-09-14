import { ClientOnly } from "./client";

export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function Page({ params }) {
  const { slug } = params;

  return <ClientOnly />;
}
