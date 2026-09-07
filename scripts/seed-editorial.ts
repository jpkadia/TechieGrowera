import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env', quiet: true });
async function main() {
  const { connectDatabase } = await import('../backend/src/config/database');
  const { BlogPost, CaseStudy } = await import('../backend/src/models/index');
  const { AdminAuditLog, AdminSession } = await import('../backend/src/models/admin');
  const { postDraft, caseDraft } = await import('../backend/src/utils/editorial-schema');
  const { posts, caseStudies } = await import('../frontend/src/content/editorial');
  const mongoose = (await import('mongoose')).default;
  await connectDatabase();
  try {
    await Promise.all([
      BlogPost.createIndexes(),
      CaseStudy.createIndexes(),
      AdminSession.createIndexes(),
      AdminAuditLog.createIndexes(),
    ]);
    let inserted = 0;
    for (const post of posts) {
      const { publishedAt, updatedAt, canonicalPath, ogImage, ...editable } = post;
      const draft = postDraft.parse(editable);
      const result = await BlogPost.updateOne(
        { slug: post.slug },
        {
          $setOnInsert: {
            title: post.title,
            slug: post.slug,
            status: 'published',
            draft,
            published: { ...draft, publishedAt, updatedAt, canonicalPath, ogImage },
            everPublished: true,
            revision: 1,
          },
        },
        { upsert: true },
      );
      inserted += result.upsertedCount;
    }
    for (const item of caseStudies) {
      const { updatedAt, ...editable } = item;
      const draft = caseDraft.parse(editable);
      const result = await CaseStudy.updateOne(
        { slug: item.slug },
        {
          $setOnInsert: {
            projectName: item.title,
            slug: item.slug,
            status: 'published',
            draft,
            published: { ...draft, updatedAt },
            everPublished: true,
            revision: 1,
          },
        },
        { upsert: true },
      );
      inserted += result.upsertedCount;
    }
    if (inserted)
      await AdminAuditLog.create({
        actor: 'system',
        action: 'migrate_content',
        target: 'initial editorial library',
        outcome: 'success',
        detail: `${inserted} reference records imported without replacing existing content`,
        expiresAt: new Date(Date.now() + 180 * 86400000),
      });
    console.log(
      `Editorial migration complete: ${inserted} records added; existing content preserved.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}
main().catch((error) => {
  console.error('Editorial migration failed:', error.name);
  process.exitCode = 1;
});
