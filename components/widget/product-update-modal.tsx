import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/axios";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Loader2, Pencil } from "lucide-react";
import { Product } from "@/app/admin/product/columns";

interface UpdateProductModalProps {
  product: Product;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(2, { message: "Product description must be at least 2 characters." }),
  price: z.number().min(1, { message: "Price must be a valid number." }),
  stock: z.number().min(1, { message: "Stock must be a valid number." }),
});

export function UpdateProductModal({ product, onSuccess }: UpdateProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/product-update", {
        id: product.id,
        ...values
      });
      console.log(response)

      // Revalidate SWR Cache
      onSuccess();

      // Form Reset + Close Modal/Dialog
      form.reset();
      setOpenDialog(false);

      toast.success(response.data.message);

    } catch (error) {
      toast.error("Failed to create product!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Pencil className="mr-2 h-4 w-4" />
          Update Product
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Modify the fields below and save to update this product.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Product Name Field */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Product Description Field */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Product Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Product Stocks Field */}
            <FormField control={form.control} name="stock" render={({ field }) => (
              <FormItem>
                <FormLabel>Stocks</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Product Stocks" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Product Price Field */}
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Product Price" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
                ) : (
                  "Save Product"
                )
              }
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}