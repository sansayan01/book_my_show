import React from 'react'

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#2A2A2A] rounded ${className}`} />
)

export const MovieCardSkeleton = () => (
  <div className="flex-shrink-0 w-48">
    <Skeleton className="aspect-[2/3] rounded-xl" />
    <div className="mt-3 space-y-2">
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  </div>
)

export const EventCardSkeleton = () => (
  <div className="flex-shrink-0 w-72">
    <Skeleton className="h-44 rounded-xl" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
    </div>
  </div>
)

export const BannerSkeleton = () => (
  <div className="absolute inset-0">
    <Skeleton className="h-full w-full" />
  </div>
)

export const ListingCardSkeleton = () => (
  <div className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-gray-800">
    <Skeleton className="h-40 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
    </div>
  </div>
)

export const ProfileSkeleton = () => (
  <div className="bg-[#1A1A1A] min-h-screen">
    <div className="bg-gradient-to-r from-[#FF0040] to-[#FF6B35] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-4 p-4 bg-[#1F1F1F] rounded-xl">
          <Skeleton className="w-24 h-32 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default { MovieCardSkeleton, EventCardSkeleton, BannerSkeleton, ListingCardSkeleton, ProfileSkeleton }
