/** Pack Blender's transparent renders as small, deterministic WebP atlases. */
import sharp from "sharp";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "public/characters/luma");
const source = path.join(root, "artifacts/luma-frames");
const tile = 384;
await mkdir(output, { recursive: true });
for (const clip of ["saludar", "leer", "pensar", "celebrar", "volar"]) {
  const frames = await Promise.all(
    Array.from({ length: 48 }, (_, i) =>
      sharp(path.join(source, clip, `${String(i).padStart(2, "0")}.png`))
        .resize(tile, tile)
        .png()
        .toBuffer(),
    ),
  );
  const composite = frames.map((input, i) => ({
    input,
    left: (i % 6) * tile,
    top: Math.floor(i / 6) * tile,
  }));
  const filename = path.join(output, `${clip}-v3.webp`);
  await sharp({
    create: {
      width: tile * 6,
      height: tile * 8,
      channels: 4,
      background: "#0000",
    },
  })
    .composite(composite)
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(filename);
  console.log(clip, (await stat(filename)).size);
}
await sharp(path.join(source, "preview.png"))
  .resize(512, 512)
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile(path.join(output, "poster-v3.webp"));

// A standalone animated preview for reviewing the flight outside the website.
const flightFrames = Array.from({ length: 48 }, (_, i) =>
  path.join(source, "volar", `${String(i).padStart(2, "0")}.png`),
);
await sharp(flightFrames, { join: { animated: true } })
  .webp({ quality: 85, loop: 0, delay: Array(48).fill(42), effort: 3 })
  .toFile(path.join(root, "assets/blender/luma-vuelo.webp"));

// Confirm that the reusable model contains all five named clips.
const glb = await readFile(
  path.join(root, "assets/blender/luma-referencia.glb"),
);
const jsonLength = glb.readUInt32LE(12);
const model = JSON.parse(glb.subarray(20, 20 + jsonLength).toString("utf8"));
const clips = model.animations?.map((animation) => animation.name) ?? [];
if (
  !["Saludar", "Leer", "Pensar", "Celebrar", "Volar"].every((name) =>
    clips.includes(name),
  )
) {
  throw new Error(`Missing GLB animations: ${clips.join(", ")}`);
}
await writeFile(
  path.join(output, "procedencia.txt"),
  "Luma · recreación 3D para LeeContigo IA a partir de la imagen proporcionada por el usuario.\n" +
    "Modelado, materiales, controles, iluminación y animaciones creados en Blender 5.2.2 LTS.\n" +
    "Fuente editable: assets/blender/luma-referencia.blend\n" +
    `Animaciones GLB verificadas: ${clips.join(", ")}\n` +
    "Referencia: assets/blender/referencia-luma.png, también incluida en la escena editable.\n" +
    "Geometría, materiales, controles y animaciones construidos en Blender.\n",
  "utf8",
);
console.log("LUMA_PACKED", clips);
