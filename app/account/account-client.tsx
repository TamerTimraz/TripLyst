"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera} from "lucide-react"
import { updateAccount } from "./actions"
import { convertToJpg } from "@/lib/utils"
import { uploadProfileImage } from "@/lib/storage/upload-images"

interface AccountClientProps {
    account_id: string
    account_name: string
    account_email: string
    image_url: string | null
    dateJoined: string
}

export default function AccountClient({account_id, account_name, account_email, image_url, dateJoined}: AccountClientProps) {
  const [name, setName] = useState(account_name)
  const [email] = useState(account_email)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(image_url)

  const nameChanged = name.trim() !== account_name.trim()
  const imageChanged = imageFile !== null
  const changed = nameChanged || imageChanged

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!changed) {
      console.log("No changes deteced")
      return
    }

    let imageUrl = null
    if (imageChanged) {
      let jpgFile = imageFile
      if (imageFile.name.split(".").pop() !== "jpg") {
        jpgFile = await convertToJpg(imageFile, 0.85, "profilePic.jpg")
      }
      imageUrl = await uploadProfileImage(jpgFile, account_id)
    }

    await updateAccount({
      name: nameChanged ? name : null,
      imageUrl
    })
  }

  const handleCancel = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(null)
    setImagePreview(image_url)
    setName(account_name)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12 mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information
            </p>
          </div>

          {/* Profile Form */}
          <div className="bg-card rounded-xl border border-border p-8 space-y-8">
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={imagePreview || undefined}
                    alt={name}
                  />
                  <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                    {name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="profile-image"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted/80 text-secondary-foreground rounded-lg transition-colors font-medium"
                    >
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Label>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/jpeg"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or WEBP. Max size 50MB
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="max-w-md bg-background"
              />
            </div>

            {/* Email Field (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                disabled
                className="max-w-md bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-since">Member Since</Label>
              <Input id="member-since" value={dateJoined} disabled className="max-w-md bg-muted" />
            </div>

            <div className="border-t border-border" />

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={!changed} className="cursor-pointer">Save Changes</Button>
              <Button variant="outline" onClick={handleCancel} className="cursor-pointer">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
