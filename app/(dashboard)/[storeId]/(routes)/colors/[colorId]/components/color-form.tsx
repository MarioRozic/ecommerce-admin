"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Color } from "@prisma/client"
import { Trash } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
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
import ApiAlert from "@/components/ui/api-alert"
import useOrigin from "@/hooks/use-origin"

interface ColorsFormProps {
  initialData: Color | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
})

type ColorFormValues = z.infer<typeof formSchema>

export default function ColorsForm({ initialData }: ColorsFormProps) {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit color" : "Create color"
  const description = initialData ? "Edit color details" : "Create a new color"
  const toastMessage = initialData ? "Color updated" : "Color created"
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  })

  const onSubmit = async (values: ColorFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values
        )
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values)
      }

      router.push(`/${params.storeId}/colors`)
      toast.success(toastMessage)
    } catch (error) {
      console.log(error)
      toast.error("Failed to update color")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success("Color deleted")
    } catch (error) {
      console.log(error)
      toast.error("Make sure you removed all products using this color.")
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
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
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
