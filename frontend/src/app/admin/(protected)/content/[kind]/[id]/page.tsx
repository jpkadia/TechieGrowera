import { notFound } from 'next/navigation';
import { ContentEditor } from '@/components/admin/editor';
export default async function Page({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if ((kind !== 'blog' && kind !== 'case-studies') || (id !== 'new' && !/^[a-f0-9]{24}$/.test(id)))
    notFound();
  return <ContentEditor key={`${kind}:${id}`} kind={kind} id={id} />;
}
