import { SectionTitle } from "@/components";
import { Loader } from "@/components/Loader";
import { WishlistModule } from "@/components/modules/wishlist";
import { Suspense } from "react";

const WishlistPage = () => {
  return (
    <div className="bg-white">
      <SectionTitle title="Wishlist" path="Home | Wishlist" />
      <div className="mx-auto max-w-screen-2xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
          Your Wishlist
        </h1>
        <Suspense fallback={<Loader />}>
          <WishlistModule />
        </Suspense>
      </div>
    </div>
  );
};

export default WishlistPage;
