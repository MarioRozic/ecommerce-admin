import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"

export default function SetupPage() {
  return (
    <>
      <div className="p-4">this is a protected route</div>
      <UserButton afterSignOutUrl="/" />
    </>
  )
}
