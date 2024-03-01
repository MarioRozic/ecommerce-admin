"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Billboard, Category } from "@prisma/client"
import { Trash } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/modals/alert-modal"
import useOrigin from "@/hooks/use-origin"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>

export default function CategoryForm({
  initialData,
  billboards,
}: CategoryFormProps) {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit category" : "Create category"
  const description = initialData
    ? "Edit category details"
    : "Create a new category"
  const toastMessage = initialData ? "Category updated" : "Category created"
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  })

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values
        )
      } else {
        await axios.post(`/api/${params.storeId}/categories`, values)
      }

      router.push(`/${params.storeId}/categories`)
      toast.success(toastMessage)
    } catch (error) {
      console.log(error)
      toast.error("Failed to update store")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(
        `/api/${params.storeId}/categories/${params.billboardId}`
      )
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success("Category deleted")
    } catch (error) {
      console.log(error)
      toast.error("Make sure you removed all products using this category.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}
