import { SkipLink } from '@/components/a11y/SkipLink';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getCurrentUser } from '@/lib/auth/demo-session';
import { buildRootMetadata } from '@/lib/seo/metadata';
import { buildOrganizationJsonLd } from '@/lib/seo/jsonld';
import './globals.css';

export const metadata = buildRootMetadata();

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <html lang="ja">
      <body>
        <SkipLink />
        <SiteHeader currentUser={currentUser} />

        <div id="main">{children}</div>

        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
