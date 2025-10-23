import { useState } from "react";
import { api } from "@/lib/axios";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Trash2, Loader2 } from 'lucide-react';

interface DeleteProductModalProps {
  productId: string;
  onSuccess: () => void;
}

export function DeleteProductModal({ productId, onSuccess }: DeleteProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/product-hard-delete", {
        id: productId,
      });

      // Revalidate SWR Cache
      onSuccess();

      // Close Modal
      setOpenDialog(false);

      toast.success(response.data.message);

    } catch (error) {
      toast.error("Failed to delete product!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Product
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
                ) : (
                  "Delete"
                )
              }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}