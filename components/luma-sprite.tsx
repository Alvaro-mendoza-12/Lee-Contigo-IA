"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./luma.module.css";

export type LumaClip = "saludar" | "leer" | "pensar" | "celebrar" | "volar";

/** A Blender-rendered character. No WebGL, frame timers or React frame updates. */
export function LumaSprite({
  clip = null,
  animate = false,
  sequence = "0",
  loop = false,
  onComplete,
}: {
  clip?: LumaClip | null;
  animate?: boolean;
  sequence?: string;
  loop?: boolean;
  onComplete?: () => void;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [loaded, setLoaded] = useState<LumaClip | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });
    observer.observe(element);
    function visibility() {
      setTabVisible(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!clip || !animate || !inView || !tabVisible) return;
    let cancelled = false;
    const atlas = new window.Image();
    atlas.src = `/characters/luma/${clip}-v3.webp`;
    void atlas
      .decode()
      .then(() => {
        if (!cancelled) setLoaded(clip);
      })
      .catch(() => {
        // Keep the static, accessible poster when an animation cannot load.
      });
    return () => {
      cancelled = true;
    };
  }, [clip, animate, inView, tabVisible]);

  const ready = animate && clip !== null && loaded === clip;
  return (
    <span
      ref={host}
      className={styles.sprite}
      aria-hidden="true"
      data-luma-clip={clip ?? "quieta"}
    >
      <Image
        className={styles.poster}
        src="/characters/luma/poster-v3.webp"
        width={384}
        height={384}
        sizes="(max-width: 640px) 180px, 340px"
        alt=""
        draggable={false}
        unoptimized
      />
      {ready ? (
        <span
          key={`${clip}:${sequence}`}
          className={styles.atlas}
          data-luma-playing={inView && tabVisible}
          data-luma-loop={loop}
          onAnimationEnd={onComplete}
          style={{
            backgroundImage: `url(/characters/luma/${clip}-v3.webp)`,
          }}
        />
      ) : null}
    </span>
  );
}
