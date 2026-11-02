import Image from "next/image";

/** The same original Blender character in the small decorative placements. */
export function ReadingFriend() {
  return (
    <Image
      className="reading-friend"
      src="/characters/luma/poster-v3.webp"
      width={180}
      height={180}
      alt=""
      aria-hidden="true"
      draggable={false}
      unoptimized
    />
  );
}
