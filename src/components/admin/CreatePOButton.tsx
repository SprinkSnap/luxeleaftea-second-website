"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreatePOButton({
  alerts,
  supplierId,
}: {
  alerts: {
    id: string;
    variantId: string;
    sku: string;
    qty: number;
    productName: string;
  }[];
  supplierId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function create() {
    if (!supplierId || !alerts.length) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId,
          alertIds: alerts.map((a) => a.id),
          items: alerts.map((a) => ({
            variantId: a.variantId,
            sku: a.sku,
            quantity: a.qty,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={create}
      disabled={loading || !alerts.length || !supplierId}
      className="h-10 rounded-[var(--radius-md)] bg-brand-forest px-4 text-sm text-white disabled:opacity-50"
    >
      {loading ? "Creating…" : "Create PO from alerts"}
    </button>
  );
}
