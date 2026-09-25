import { notFound } from 'next/navigation';
import { ContentList } from '@/components/admin/content';
export default async function Page({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (kind !== 'blog' && kind !== 'portfolio') notFound();
  return <ContentList kind={kind} />;
}
