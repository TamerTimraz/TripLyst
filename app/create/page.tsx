"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Plus, X, Globe, Lock, Upload, Sparkles } from "lucide-react"
import { convertToJpg, formatDate } from "@/lib/utils"
import { createItinerary, updateItineraryImage } from "@/app/itineraries/actions"
import { generateItineraryWithAI } from "@/app/itineraries/ai-actions"
import { uploadItineraryImage } from "@/lib/storage/upload-images"
import { redirect } from "next/navigation"

interface Activity {
  tempKey: string // UI-only key
  title: string
  description: string
}

interface Day {
  date: string
  activities: Activity[]
}

const MAX_AI_TRIP_DAYS = 7

export default function CreateItineraryPage() {
  const [useAI, setUseAI] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [preferences, setPreferences] = useState("")

  const [title, setTitle] = useState("")
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  const [days, setDays] = useState<Day[]>([])
  const [isPublic, setIsPublic] = useState(true)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Add days after inputting start and end date
  useEffect(() => {
    if (useAI) return

    if (!startDate || !endDate) {
        setDays([])
        return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) {
        setDays([])
        return
    }

    const dayCount = getTripLength()

    setDays((prevDays) => {
        return Array.from({ length: dayCount }, (_, index) => {
        const date = new Date(start)
        date.setDate(start.getDate() + index)

        return {
            date: date.toISOString().split("T")[0], // YYYY-MM-DD
            activities: prevDays[index]?.activities ?? [],
        }
        })
    })
    }, [startDate, endDate, useAI])


  const getTripLength = () => {
    if (!startDate || ! endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    return (
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
  }

  const handleGenerateWithAI = async () => {
    if (!destination || !startDate || !endDate) {
      alert("Please fill in destination and dates")
      return
    }

    setIsGenerating(true)

    try {
      const aiData = await generateItineraryWithAI({
        destination,
        startDate,
        endDate,
        preferences
      })

      // Populate form state
      setTitle(aiData.title)
      setDescription(aiData.description ?? "")

      setDays(
        aiData.days.map((day: any) => ({
          date: day.date,
          activities: day.activities.map((a: any) => ({
            tempKey: crypto.randomUUID(),
            title: a.title,
            description: a.description ?? "",
          })),
        }))
      )
      
      // Switch back to manual mode so user can edit
      setUseAI(false)
    } catch (err) {
      console.error(err)
      alert("Failed to generate itinerary. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const addActivity = (dayIndex: number) => {
    const newDays = [...days]
    newDays[dayIndex].activities.push({
      tempKey: crypto.randomUUID(),
      title: "",
      description: "",
    })
    setDays(newDays)
  }

  const removeActivity = (dayIndex: number, tempKey: string) => {
    const newDays = [...days]
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter((a) => a.tempKey !== tempKey)
    setDays(newDays)
  }

  const updateActivity = (dayIndex: number, tempKey: string, field: keyof Activity, value: string) => {
    const newDays = [...days]
    const activity = newDays[dayIndex].activities.find((a) => a.tempKey === tempKey)
    if (activity) {
      activity[field] = value
      setDays(newDays)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setCoverImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const itineraryId = await createItinerary({
        title,
        description: description || null,
        destination,
        startDate,
        endDate,
        visibility: isPublic ? "public" : "private",
        days: days.map((day) => ({
            date: day.date,
            activities: day.activities.map((a) => ({
                title: a.title,
                description: a.description || null,
            })),
        })),
    })

    // Upload itinerary image to bucket and its URL to the database
    if (coverImage) {
      let jpgFile = coverImage
      if (coverImage.name.split(".").pop() !== "jpg") {
        jpgFile = await convertToJpg(coverImage, 0.85, "cover.jpg")
      }
      const imageUrl = await uploadItineraryImage(jpgFile, itineraryId)
      await updateItineraryImage(itineraryId, imageUrl)
    }

    // Redirect on success
    redirect(`/itineraries/${itineraryId}`)
  }


  return (
    <div className="min-h-screen bg-background">
      <main className="container py-12 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create New Itinerary
          </h1>
          <p className="text-muted-foreground">
            Plan your perfect trip and share it with the world
          </p>
        </div>

        <Card className="p-6 bg-card border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Creation Mode
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose how you want to create your itinerary
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setUseAI(false)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                !useAI
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-accent/10"
              }`}
            >
              <Plus className="h-4 w-4" />
              Manual
            </button>
            <button
              type="button"
              onClick={() => setUseAI(true)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                useAI
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-accent/10"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI-Assisted
            </button>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {useAI ? (
            // AI Generation Form
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Generate with AI
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Provide basic information and let AI create a detailed itinerary
                for you
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ai-destination" className="text-foreground">
                    <p>
                      Destination <span className="text-red-600">*</span>
                    </p>
                  </Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ai-destination"
                      placeholder="e.g., Tokyo, Japan"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="pl-10 bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ai-startDate" className="text-foreground">
                      <p>
                        Start Date <span className="text-red-600">*</span>
                      </p>
                    </Label>
                    <div className="relative mt-1.5">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ai-startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="pl-10 bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ai-endDate" className="text-foreground">
                      <p>
                        End Date <span className="text-red-600">*</span>
                      </p>
                    </Label>
                    <div className="relative mt-1.5">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ai-endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        min={startDate}
                        className="pl-10 bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferences" className="text-foreground">
                    Preferences <p className="text-foreground/70">(Optional)</p>
                  </Label>
                  <Textarea
                    id="preferences"
                    placeholder="e.g., I love food tours, museums, and want to avoid crowded places. Budget-friendly options preferred."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    rows={4}
                    className="mt-1.5 bg-background"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={
                    !destination || !startDate || !endDate || isGenerating || getTripLength() > MAX_AI_TRIP_DAYS
                  }
                  className="w-full gap-2 cursor-pointer"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Itinerary"}
                </Button>

                {getTripLength() > MAX_AI_TRIP_DAYS && (
                  <p className="text-sm text-destructive mt-2 text-center">
                    AI generation is limited to {MAX_AI_TRIP_DAYS} days.
                  </p>
                )}
              </div>
            </Card>
          ) : (
            // Manual Creation Form
            <>
              {/* Basic Information */}
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-foreground">
                      <p>
                        Trip Title <span className="text-red-600">*</span>
                      </p>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., 7 Days in Tokyo"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="mt-1.5 bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="destination" className="text-foreground">
                      <p>
                        Destination <span className="text-red-600">*</span>
                      </p>
                    </Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="destination"
                        placeholder="e.g., Tokyo, Japan"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                        className="pl-10 bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground">Cover Image <p className="text-foreground/70">(Optional)</p></Label>
                    <div className="mt-1.5">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Cover preview"
                            className="w-full h-64 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-2 right-2 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Label
                          htmlFor="coverImage"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border shadow-sm rounded-lg cursor-pointer bg-background hover:bg-muted/10 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="mb-2 text-sm text-foreground font-medium">
                              Click to upload cover image
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG or WEBP (MAX. 50MB)
                            </p>
                          </div>
                          <input
                            id="coverImage"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Label>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-foreground">
                        <p>
                          Start Date <span className="text-red-600">*</span>
                        </p>
                      </Label>
                      <div className="relative mt-1.5 bg-background">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="endDate" className="text-foreground">
                        <p>
                          End Date <span className="text-red-600">*</span>
                        </p>
                      </Label>
                      <div className="relative mt-1.5 bg-background">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                          min={startDate}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-foreground">
                      Description <p className="text-foreground/70">(Optional)</p>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your trip..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-1.5 bg-background"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground mb-3 block">
                      Privacy
                    </Label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPublic(true)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                          isPublic
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:bg-accent/10"
                        }`}
                      >
                        <Globe className="h-4 w-4" />
                        Public
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPublic(false)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                          !isPublic
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:bg-accent/10"
                        }`}
                      >
                        <Lock className="h-4 w-4" />
                        Private
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Days and Activities */}
              {days.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Daily Activities
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {days.length} {days.length === 1 ? "day" : "days"} planned
                    </p>
                  </div>

                  {days.map((day, dayIndex) => (
                    <Card key={dayIndex} className="p-6 bg-card border-border">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          Day {dayIndex + 1}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(day.date)}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {day.activities.map((activity) => (
                          <div
                            key={activity.tempKey}
                            className="p-4 rounded-lg border border-border space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <Label className="text-xs text-muted-foreground">
                                  <p>
                                    Activity Title{" "}
                                    <span className="text-red-600">*</span>
                                  </p>
                                </Label>
                                <Input
                                  placeholder="e.g., Visit Senso-ji Temple"
                                  value={activity.title}
                                  onChange={(e) =>
                                    updateActivity(
                                      dayIndex,
                                      activity.tempKey,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  required
                                  className="mt-1 h-9 text-sm bg-background"
                                />
                              </div>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeActivity(dayIndex, activity.tempKey)
                                }
                                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-transparent cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Description (Optional)
                              </Label>
                              <Textarea
                                placeholder="Add details about this activity..."
                                value={activity.description}
                                onChange={(e) =>
                                  updateActivity(
                                    dayIndex,
                                    activity.tempKey,
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="mt-1 text-sm bg-background"
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addActivity(dayIndex)}
                          className="w-full gap-2 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          Add Activity
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {days.length === 0 && startDate && endDate && (
                <Card className="p-8 text-center border-border border-dashed">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Select valid travel dates to start planning your daily
                    activities
                  </p>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={
                    !title ||
                    !destination ||
                    !startDate ||
                    !endDate ||
                    days.length === 0 ||
                    days.some(
                      (day) =>
                        day.activities.length === 0 ||
                        day.activities.some((a) => !a.title)
                    )
                  }
                  className="flex-1 cursor-pointer"
                >
                  Create Itinerary
                </Button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  )
}
