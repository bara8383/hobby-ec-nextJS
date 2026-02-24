import Link from 'next/link';

export function SkipLink() {
  return (
    <Link className="skip-link" href="#main">
      コンテンツへスキップ
    </Link>
  );
}
