import SkeletonLoader from '@/components/SkeletonLoader';

/**
 * Global loading component used by Next.js App Router.
 * It will be displayed automatically while any page is loading.
 */
export default function Loading() {
  return <SkeletonLoader />;
}
