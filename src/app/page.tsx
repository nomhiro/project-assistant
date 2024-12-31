import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export default function Home() {
  return (
    <div className="items-center justify-items-center justify-start w-full p-8 gap-8">
      <Breadcrumb items={[{ label: "ホーム", href: "/" }]} />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold mt-4">アシスタント機能</h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            アシスタント機能ページへのリンクは{" "}
            <Link href="/assistant">
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                /assistant
              </code>
            </Link>
            です。
          </li>
          <li>議事録管理機能は{" "}
            <Link href="/minutes">
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                /minutes
              </code>
            </Link>
            です。
          </li>
        </ol>
      </main>
    </div>
  );
}