import Link from "next/link";
import { PixelButton, PixelPanel } from "@/components/ui/pixel";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-4">
      <PixelPanel className="text-center max-w-md">
        <div className="font-pixel text-4xl text-hp">404</div>
        <p className="text-ink-dim mt-3">
          You wandered off the map. A wild MISSING PAGE appeared!
        </p>
        <Link href="/arena" className="inline-block mt-5">
          <PixelButton>Run back to the Arena</PixelButton>
        </Link>
      </PixelPanel>
    </main>
  );
}
