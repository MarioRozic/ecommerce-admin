import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CategoryColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import AlertModal from "@/components/modals/alert-modal"

interface CellActionProps {
  data: CategoryColumn
}
export default function CellAction({ data }: CellActionProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const params = useParams()
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Copied to clipboard")
  }

  const onEdit = () => {
    router.push(`/${params.storeId}/categories/${data.id}`)
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
      router.refresh()
      // router.push("/")
      toast.success("Category deleted")
    } catch (error) {
      console.log(error)
      toast.error("Make sure you removed all products using this category.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Copy
            ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />{" "}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
