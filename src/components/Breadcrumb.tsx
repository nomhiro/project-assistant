import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex space-x-2 text-sm">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <Link href={item.href} className="text-blue-500 hover:underline">
            {item.label}
          </Link>
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}