import { notFound } from 'next/navigation';
import { ContentList } from '@/components/admin/content';
export default async function Page({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (kind !== 'blog' && kind !== 'case-studies') notFound();
  return <ContentList kind={kind} />;
}
