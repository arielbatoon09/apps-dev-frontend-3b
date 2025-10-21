"use client"

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

import { columns, Product } from "./columns";
import { DataTable } from "./data-table";

import { CreateProductModal } from "@/components/widget/product-create-modal"; 

export default function ProductAdminPage() {
  // Fetch Data
  const { data: response, mutate } = useSWR("/api/v1/product-list", fetcher);
  const data: Product[] = response?.data || [];

  return (
    <section>
      <div className="container mx-auto py-10">
        <CreateProductModal onSuccess={mutate} />
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  )
}