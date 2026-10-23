import { useId } from "react";
import type { ScenePlan, SceneDescription } from "@/lib/story-illustrations";
const colors = {
  gold: "#edbd55",
  coral: "#e88864",
  mint: "#79b994",
  blue: "#70b4cd",
  violet: "#ad9ace",
  brown: "#b28b63",
};

function Character({
  kind,
  color,
  active,
}: ScenePlan["characters"][number] & { active: boolean }) {
  const fill = colors[color];
  const face = (
    <>
      <circle cx="-12" cy="-61" r="4" fill="#243e3b" />
      <circle cx="12" cy="-61" r="4" fill="#243e3b" />
      <circle cx="-13" cy="-63" r="1.2" fill="white" />
      <circle cx="11" cy="-63" r="1.2" fill="white" />
      <path
        d="M-8 -48 Q0 -39 8 -48"
        fill="none"
        stroke="#68442e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="-24" cy="-49" rx="7" ry="4" fill="#efb1a0" opacity=".65" />
      <ellipse cx="24" cy="-49" rx="7" ry="4" fill="#efb1a0" opacity=".65" />
    </>
  );
  if (kind === "cloud")
    return (
      <g>
        <path
          d="M-50 -35 C-80 -45 -63 -84 -39 -79 C-38 -120 9 -127 22 -94 C49 -116 77 -82 61 -60 C90 -28 40 -11 13 -24 C-14 -10 -35 -18 -50 -35Z"
          fill="#fffefa"
          stroke="#cadce0"
          strokeWidth="3"
        />
        {face}
      </g>
    );
  if (kind === "turtle")
    return (
      <g>
        <ellipse
          cx="-12"
          cy="-25"
          rx="53"
          ry="39"
          fill={fill}
          stroke="#477b5d"
          strokeWidth="4"
        />
        <path
          d="M-48 -27 L-29 -47 L-7 -44 L10 -24 L-3 -4 L-29 -6Z"
          fill="none"
          stroke="#477b5d"
          strokeWidth="3"
        />
        <ellipse cx="-47" cy="9" rx="15" ry="10" fill="#93bd78" />
        <ellipse cx="13" cy="10" rx="15" ry="10" fill="#93bd78" />
        <g transform="translate(47 17) scale(.7)">
          <ellipse cy="-64" rx="34" ry="38" fill="#a5cb8a" />
          {face}
        </g>
      </g>
    );
  if (kind === "fish")
    return (
      <g>
        <path d="M-46 -57 L-80 -84 L-77 -24Z" fill={fill} />
        <ellipse cx="0" cy="-55" rx="55" ry="35" fill={fill} />
        <path d="M-3 -42 Q-22 -28 -28 -52" fill="#ffdf8b" />
        <g transform="translate(17 0) scale(.8)">{face}</g>
      </g>
    );
  if (kind === "firefly")
    return (
      <g>
        <circle cy="-19" r="43" fill="#ffe99b" opacity=".35" />
        <ellipse
          cx="-23"
          cy="-69"
          rx="16"
          ry="31"
          transform="rotate(-30 -23 -69)"
          fill="#e1f5ec"
        />
        <ellipse
          cx="23"
          cy="-69"
          rx="16"
          ry="31"
          transform="rotate(30 23 -69)"
          fill="#e1f5ec"
        />
        <ellipse cy="-35" rx="23" ry="34" fill="#f4cf63" />
        <circle cy="-78" r="26" fill={fill} />
        <g transform="translate(0 -31) scale(.65)">{face}</g>
        <path
          d="M-10 -99 Q-24 -124 -29 -115 M10 -99 Q24 -124 29 -115"
          stroke="#695d3d"
          strokeWidth="3"
          fill="none"
        />
      </g>
    );
  return (
    <g>
      {kind === "squirrel" ? (
        <path
          d="M25 -10 C105 -14 99 -129 50 -111 C14 -98 47 -59 66 -82 C67 -40 20 -51 25 -10"
          fill={fill}
          stroke="#a36e42"
          strokeWidth="3"
        />
      ) : kind === "fox" ||
        kind === "cat" ||
        kind === "dog" ||
        kind === "dragon" ? (
        <path
          d="M25 -9 Q88 -3 65 -50 Q51 -24 26 -30"
          fill={fill}
          stroke="#a87f52"
          strokeWidth="2"
        />
      ) : null}
      {kind === "dragon" ? (
        <>
          <path
            d="M-23 -38 L-70 -80 L-60 -25Z M23 -38 L70 -80 L60 -25Z"
            fill="#b0d7bc"
          />
          <path
            d="M-32 -96 L-27 -122 L-15 -99 M15 -99 L27 -122 L32 -96"
            fill="#e7c977"
          />
        </>
      ) : null}
      {kind === "bird" ? (
        <ellipse cy="-29" rx="39" ry="43" fill={fill} />
      ) : kind === "seed" ? (
        <ellipse cy="-50" rx="36" ry="55" fill="#b88f5a" />
      ) : (
        <rect x="-29" y="-48" width="58" height="55" rx="23" fill={fill} />
      )}
      <ellipse
        cx="-20"
        cy="10"
        rx="17"
        ry="9"
        fill={kind === "child" ? "#43565b" : fill}
      />
      <ellipse
        cx="20"
        cy="10"
        rx="17"
        ry="9"
        fill={kind === "child" ? "#43565b" : fill}
      />
      {kind === "rabbit" ? (
        <>
          <ellipse cx="-19" cy="-118" rx="13" ry="42" fill={fill} />
          <ellipse cx="19" cy="-118" rx="13" ry="42" fill={fill} />
          <ellipse cx="-19" cy="-118" rx="6" ry="27" fill="#f5cec2" />
          <ellipse cx="19" cy="-118" rx="6" ry="27" fill="#f5cec2" />
        </>
      ) : ["fox", "cat", "dragon"].includes(kind) ? (
        <path
          d="M-36 -81 L-31 -113 L-8 -91 M8 -91 L31 -113 L36 -81"
          fill={fill}
        />
      ) : kind === "dog" ? (
        <>
          <ellipse cx="-33" cy="-72" rx="15" ry="32" fill="#936e50" />
          <ellipse cx="33" cy="-72" rx="15" ry="32" fill="#936e50" />
        </>
      ) : null}
      {kind === "seed" ? (
        <path d="M0 -96 Q-8 -134 31 -131 Q25 -99 0 -96Z" fill="#79b994" />
      ) : null}
      {kind === "robot" ? (
        <>
          <rect
            x="-36"
            y="-98"
            width="72"
            height="64"
            rx="16"
            fill="#c8e2dd"
            stroke="#668b87"
            strokeWidth="3"
          />
          <path d="M0 -98 L0 -118" stroke="#668b87" strokeWidth="3" />
          <circle cy="-120" r="6" fill="#e88864" />
        </>
      ) : kind === "seed" || kind === "bird" ? null : (
        <circle cy="-66" r="38" fill={kind === "child" ? "#dba679" : fill} />
      )}
      {kind === "child" ? (
        <path
          d="M-37 -67 C-51 -124 46 -126 39 -67 L20 -88 Q-4 -65 -28 -84Z"
          fill="#4b3d34"
        />
      ) : null}
      {kind === "fox" ? (
        <path
          d="M-34 -57 L0 -30 L34 -57 Q18 -68 0 -51 Q-18 -68 -34 -57"
          fill="#fff2d5"
        />
      ) : null}
      {face}
      {kind === "bird" ? (
        <path d="M-7 -53 L10 -49 L-3 -40Z" fill="#df9b48" />
      ) : null}
      <path
        d={
          active
            ? "M-28 -30 Q-53 -59 -46 -73 M28 -30 Q47 -57 45 -71"
            : "M-28 -30 Q-48 -20 -43 -7 M28 -30 Q47 -20 43 -7"
        }
        fill="none"
        stroke={kind === "child" ? "#dba679" : fill}
        strokeWidth="12"
        strokeLinecap="round"
      />
      {kind === "child" ? (
        <path
          d="M-27 -39 Q0 -28 27 -39"
          stroke="#fff0cb"
          strokeWidth="6"
          fill="none"
        />
      ) : null}
    </g>
  );
}
function Prop({ kind }: { kind: SceneDescription["object"] }) {
  if (kind === "none") return null;
  if (kind === "bridge")
    return (
      <g>
        <path
          d="M-100 2 Q0 -44 100 2"
          stroke="#9c754c"
          strokeWidth="13"
          fill="none"
        />
        <path
          d="M-90 -35 L-90 5 M-45 -50 L-45 -8 M0 -54 L0 -15 M45 -50 L45 -8 M90 -35 L90 5"
          stroke="#795b3f"
          strokeWidth="6"
        />
        <path
          d="M-94 -36 Q0 -77 94 -36"
          stroke="#795b3f"
          strokeWidth="5"
          fill="none"
        />
      </g>
    );
  if (kind === "map" || kind === "book")
    return (
      <g>
        <path
          d="M-42 -61 L0 -52 L42 -61 L42 -4 L0 5 L-42 -4Z"
          fill="#fff7de"
          stroke="#aa9570"
          strokeWidth="3"
        />
        <path d="M0 -52 L0 5" stroke="#c6b68f" strokeWidth="3" />
        {kind === "map" ? (
          <path
            d="M-29 -44 Q-8 -48 -13 -27 T27 -12"
            fill="none"
            stroke="#79a898"
            strokeWidth="4"
            strokeDasharray="6 4"
          />
        ) : (
          <path
            d="M-32 -42 L-8 -37 M10 -37 L31 -42 M-32 -27 L-8 -22 M10 -22 L31 -27"
            stroke="#b0bb9f"
            strokeWidth="3"
          />
        )}
      </g>
    );
  if (kind === "lantern")
    return (
      <g>
        <path
          d="M-13 -60 Q0 -85 13 -60"
          fill="none"
          stroke="#92734e"
          strokeWidth="4"
        />
        <rect
          x="-22"
          y="-59"
          width="44"
          height="53"
          rx="8"
          fill="#ffe499"
          stroke="#92734e"
          strokeWidth="4"
        />
        <ellipse cy="-30" rx="9" ry="16" fill="#f3b955" />
      </g>
    );
  if (kind === "flower" || kind === "seed")
    return (
      <g>
        <path
          d="M0 0 L0 -49 M0 -17 Q-30 -43 -26 -20 Q-11 -9 0 -13 M0 -28 Q28 -48 26 -27 Q15 -17 0 -21"
          fill="#79b994"
          stroke="#548d68"
          strokeWidth="3"
        />
        {kind === "flower" ? (
          <g fill="#f2bc66">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-61"
                rx="8"
                ry="16"
                transform={`rotate(${a} 0 -46)`}
              />
            ))}
            <circle cy="-46" r="10" fill="#92704a" />
          </g>
        ) : (
          <ellipse cy="-53" rx="13" ry="20" fill="#a87b4d" />
        )}
      </g>
    );
  if (kind === "bread")
    return (
      <g>
        <ellipse cy="-17" rx="45" ry="25" fill="#dba454" />
        <path
          d="M-24 -31 L-15 -15 M-4 -36 L6 -14 M17 -31 L27 -16"
          stroke="#f8df9c"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
    );
  if (kind === "basket")
    return (
      <g>
        <path
          d="M-28 -37 Q0 -88 28 -37"
          fill="none"
          stroke="#956b45"
          strokeWidth="6"
        />
        <path d="M-38 -37 L-29 0 L29 0 L38 -37Z" fill="#cd9f66" />
        <path
          d="M-32 -25 L32 -25 M-30 -11 L30 -11"
          stroke="#aa7e50"
          strokeWidth="4"
        />
      </g>
    );
  if (kind === "kite")
    return (
      <g>
        <path
          d="M0 -100 L31 -59 L0 -23 L-31 -59Z"
          fill="#75b6cf"
          stroke="#507e95"
          strokeWidth="2"
        />
        <path
          d="M0 -100 L0 -23 M-31 -59 L31 -59"
          stroke="#fbf0d7"
          strokeWidth="2"
        />
        <path
          d="M0 -23 Q-19 8 1 26"
          stroke="#cd9964"
          strokeWidth="3"
          fill="none"
        />
      </g>
    );
  if (kind === "boat")
    return (
      <g>
        <path d="M-55 -21 L55 -21 L35 2 L-35 2Z" fill="#b88a5b" />
        <path
          d="M0 -21 L0 -91 L-37 -31 L0 -31"
          fill="#ffefd3"
          stroke="#977e60"
          strokeWidth="3"
        />
      </g>
    );
  if (kind === "water")
    return (
      <g fill="#82c9d9">
        {[-22, 0, 22].map((x, i) => (
          <path
            key={x}
            transform={`translate(${x} ${i % 2 ? -15 : 0})`}
            d="M0 -42 C-23 -17 -9 0 0 0 C13 0 22 -17 0 -42Z"
          />
        ))}
      </g>
    );
  return (
    <path
      d="M0 -65 L12 -40 L39 -37 L19 -18 L24 10 L0 -3 L-24 10 L-19 -18 L-39 -37 L-12 -40Z"
      fill="#f2c45f"
      stroke="#dfa94e"
      strokeWidth="2"
    />
  );
}
export function StoryScene({
  plan,
  paragraph = 0,
  frame = 0,
}: {
  plan: ScenePlan;
  paragraph?: number;
  frame?: number;
}) {
  const id = useId().replace(/:/g, "");
  const scene = plan.scenes[Math.min(5, paragraph)];
  const night = scene.time === "night" || scene.setting === "space";
  const sky = night
    ? ["#244664", "#8094a3"]
    : scene.time === "sunset"
      ? ["#f0bf98", "#f8dfb3"]
      : ["#c5e5eb", "#f8f1d9"];
  const offset = frame % 3;
  return (
    <svg
      className="composed-story-scene"
      viewBox="0 0 600 520"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${scene.caption} Ilustración de la página ${frame + 1}.`}
      data-scene-page={frame}
    >
      <defs>
        <linearGradient id={`${id}sky`} x2="0" y2="1">
          <stop stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <linearGradient id={`${id}ground`} x2="0" y2="1">
          <stop stopColor="#c2d9a1" />
          <stop offset="1" stopColor="#8fb889" />
        </linearGradient>
      </defs>
      <rect width="600" height="520" fill={`url(#${id}sky)`} />
      {night ? (
        <g fill="#fff2c1">
          <circle cx="475" cy="92" r="30" />
          {[75, 160, 258, 365, 528].map((x, i) => (
            <circle key={x} cx={x} cy={42 + ((i * 37) % 130)} r={3 + (i % 2)} />
          ))}
        </g>
      ) : (
        <>
          <circle cx={465 - offset * 28} cy="95" r="45" fill="#fff0b6" />
          <g fill="#fffefa" opacity=".8">
            <ellipse cx="110" cy="100" rx="62" ry="19" />
            <ellipse cx="129" cy="83" rx="32" ry="28" />
            <ellipse cx="337" cy="61" rx="59" ry="17" />
          </g>
        </>
      )}
      {scene.setting === "room" ? (
        <>
          <rect
            x="48"
            y="45"
            width="150"
            height="168"
            rx="14"
            fill="#c3dce0"
            stroke="#f8f0db"
            strokeWidth="14"
          />
          <path
            d="M123 48 V212 M50 130 H196"
            stroke="#f8f0db"
            strokeWidth="9"
          />
          <rect y="330" width="600" height="190" fill="#d7ba93" />
          <path d="M0 380 H600 M0 440 H600" stroke="#c6a47a" strokeWidth="2" />
        </>
      ) : (
        <>
          <path
            d={`M0 305 Q${140 + offset * 30} 100 335 295 Q490 180 600 280 V520 H0Z`}
            fill={night ? "#57778a" : "#b4cba9"}
          />
          <path
            d="M0 351 Q150 280 320 338 Q480 270 600 344 V520 H0Z"
            fill={scene.setting === "beach" ? "#ead5a3" : `url(#${id}ground)`}
          />
        </>
      )}
      {scene.setting === "beach" || scene.setting === "river" ? (
        <>
          <path
            d={
              scene.setting === "river"
                ? "M232 308 Q390 353 244 400 Q119 440 380 520 H600 Q276 418 402 374 Q440 325 325 308Z"
                : "M0 310 Q140 286 290 315 T600 300 V367 Q430 351 270 372 T0 359Z"
            }
            fill="#83bfcb"
          />
          <path
            d="M0 348 Q150 324 290 352 T600 337"
            fill="none"
            stroke="#edf7eb"
            strokeWidth="4"
            opacity=".6"
          />
        </>
      ) : null}
      {scene.setting === "forest" ||
      scene.setting === "garden" ||
      scene.setting === "river" ? (
        <g>
          {[42, 540].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i * 20})`}>
              <path d="M-8 345 L3 138 L14 345" fill="#9c8159" />
              <ellipse
                cy="164"
                rx="74"
                ry="98"
                fill={night ? "#497c76" : "#80b497"}
              />
              <ellipse
                cx="-25"
                cy="155"
                rx="40"
                ry="64"
                fill={night ? "#5c9186" : "#a1c69d"}
              />
            </g>
          ))}
        </g>
      ) : null}
      {scene.setting === "village" ? (
        <g>
          <rect x="45" y="225" width="108" height="95" rx="5" fill="#e8d3ac" />
          <path d="M28 225 L99 163 L168 225" fill="#c88f77" />
          <rect x="82" y="268" width="32" height="52" rx="15" fill="#84aba4" />
        </g>
      ) : null}
      <g
        transform={`translate(${((frame * 13) % 31) - 15} ${offset === 1 ? 10 : 0}) scale(${1 + ((frame * 7) % 11) * 0.009})`}
      >
        {plan.characters.map((character, i) => (
          <g
            key={i}
            transform={`translate(${plan.characters.length === 1 ? 285 : 204 + i * 145} ${scene.action === "wait" ? 387 : 371}) ${i === 1 ? "scale(-1 1)" : ""} rotate(${scene.action === "travel" ? (i % 2 ? -5 : 5) : 0})`}
          >
            <ellipse cy="16" rx="49" ry="9" fill="#4e765c" opacity=".14" />
            <Character
              {...character}
              active={
                scene.action === "celebrate" ||
                (scene.action === "help" && i === 0)
              }
            />
          </g>
        ))}
        <g
          transform={`translate(${scene.object === "bridge" ? 305 : 310 + offset * 16} ${scene.object === "kite" ? 255 : 425})`}
        >
          <Prop kind={scene.object} />
        </g>
      </g>
      {scene.setting !== "room" ? (
        <g>
          {[32, 105, 485, 569].map((x, i) => (
            <g
              key={x}
              transform={`translate(${x + offset * 5} ${460 + (i % 2) * 30})`}
            >
              <path d="M0 10 L0 -12" stroke="#67946b" strokeWidth="3" />
              <circle cy="-14" r="7" fill={i % 2 ? "#f0c765" : "#f4d7bd"} />
              <circle cy="-14" r="2" fill="#ad8b57" />
            </g>
          ))}
        </g>
      ) : null}
    </svg>
  );
}
