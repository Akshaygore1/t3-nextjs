import { HydrateClient } from "@/trpc/server";
import { Banner } from "./_components/banner";
import { Signup } from "./_components/signup";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex h-full flex-col items-center justify-center text-black">
        <Banner />
        <div className="p-10">
          <Signup />
        </div>
      </main>
    </HydrateClient>
  );
}
