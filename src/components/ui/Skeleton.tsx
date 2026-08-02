import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />
);

export const SkeletonCircle: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-full bg-slate-200/80 ${className}`} />
);

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
}

// Room card grid matching RoomCard.tsx's markup (RoomList / Home featured rooms):
// aspect-[4/3] image with overlay badges + price tag, house/district row, title,
// address line, specs grid, amenity chips, footer with two actions.
export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({ count = 6, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-3xl overflow-hidden border border-slate-200/80 bg-white flex flex-col"
      >
        {/* Image with badge/price overlays */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="absolute bottom-3 left-3">
            <Skeleton className="h-7 w-20 rounded-2xl" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-4 w-14 rounded-lg" />
              <Skeleton className="h-4 w-14 rounded-lg" />
              <Skeleton className="h-4 w-10 rounded-lg" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <Skeleton className="h-9 flex-1 rounded-xl" />
            <Skeleton className="h-9 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface ListSkeletonProps {
  count?: number;
  className?: string;
}

// Notification row matching Notifications.tsx's item cards:
// icon box + title/timestamp header row + a couple of content lines.
export const NotificationListSkeleton: React.FC<ListSkeletonProps> = ({ count = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="p-5 rounded-2xl border border-slate-200/80 bg-white flex items-start gap-4"
      >
        <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-20 shrink-0" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

// Appointment card matching TenantAppointments.tsx's item cards:
// status badge + date, room title, address/phone meta lines, action button.
export const AppointmentListSkeleton: React.FC<ListSkeletonProps> = ({ count = 4, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-3 w-24 shrink-0" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
        <Skeleton className="h-9 w-full md:w-48 rounded-xl shrink-0" />
      </div>
    ))}
  </div>
);

// Room detail page skeleton matching RoomDetail.tsx's layout: gallery + thumbnail
// strip, title block, specs grid, amenities grid, description block, and the
// sticky sidebar (price box, landlord row, action buttons).
export const RoomDetailSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${className}`}>
    {/* Left column: gallery & details */}
    <div className="lg:col-span-2 space-y-8">
      <div className="space-y-3">
        <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
        <div className="flex items-center gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-16 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      <div className="space-y-3 pb-6 border-b border-slate-200">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-200/80">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-56" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-200">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>

    {/* Right column: sticky landlord/action card */}
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200/90 space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <SkeletonCircle className="w-12 h-12 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);
