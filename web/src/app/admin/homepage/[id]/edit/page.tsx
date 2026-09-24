import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SectionForm } from "../../SectionForm";

export const dynamic = "force-dynamic";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [section, products] = await Promise.all([
    prisma.homepageSection.findUnique({ where: { id } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!section) notFound();

  return (
    <SectionForm
      section={{
        id: section.id,
        type: section.type,
        heading: section.heading,
        subtext: section.subtext,
        image: section.image,
        buttonText: section.buttonText,
        buttonLink: section.buttonLink,
        productIds: section.productIds,
        categories: section.categories,
      }}
      products={products}
    />
  );
}
