import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductsControls } from "./ProductsControls";
import { DeleteProductButton } from "./DeleteProductButton";

export const dynamic = "force-dynamic";

const inr = (v: number) => "Rs. " + v.toLocaleString("en-IN");

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category, sort } = await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (category && ["men", "women", "kids"].includes(category))
    where.category = category as Prisma.ProductWhereInput["category"];

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { variants: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="font-display text-xs tracking-button bg-ink text-white px-5 py-2.5 rounded-button hover:bg-black transition-colors"
        >
          + Add product
        </Link>
      </div>

      <ProductsControls />

      <div className="bg-white border border-grey-200 mt-4 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-grey-200 text-grey-500">
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Variants</Th>
              <Th>Stock</Th>
              <Th>Featured</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-grey-500">
                  No products match. <Link href="/admin/products" className="underline">Clear filters</Link>.
                </td>
              </tr>
            )}
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="hover:bg-grey-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="font-display hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize text-grey-500">{p.category}</td>
                  <td className="px-4 py-3">{inr(p.price)}</td>
                  <td className="px-4 py-3 text-grey-500">{p.variants.length}</td>
                  <td className="px-4 py-3">
                    <span className={stock === 0 ? "text-sale" : ""}>{stock}</span>
                  </td>
                  <td className="px-4 py-3">{p.featured ? "★" : "—"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs underline mr-3"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-display text-xs tracking-label font-normal">
      {children}
    </th>
  );
}
