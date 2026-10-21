export function StoryArt({
  variant,
  className = "",
}: {
  variant: "night" | "seed";
  className?: string;
}) {
  if (variant === "seed")
    return (
      <svg
        className={className}
        viewBox="0 0 600 430"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Una semilla crece en una maceta junto a una ventana soleada"
      >
        <rect width="600" height="430" rx="28" fill="#f2dfba" />
        <circle cx="460" cy="95" r="58" fill="#e8ad60" />
        <path d="M40 330Q160 255 315 320T620 300V450H0Z" fill="#d0d3aa" />
        <path
          d="M90 0V270M500 0V270M85 175H505"
          stroke="#fff7e9"
          strokeWidth="14"
        />
        <path d="M205 300h170l-24 113h-121z" fill="#b87652" />
        <ellipse cx="290" cy="300" rx="85" ry="18" fill="#915b3e" />
        <path
          d="M290 300V176"
          stroke="#426b4a"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M288 245c-90 8-111-79-104-98 71-4 114 39 104 98"
          fill="#698866"
        />
        <path
          d="M291 215c-10-80 67-114 91-104 3 66-36 107-91 104"
          fill="#426b4a"
        />
        <path
          d="M250 354h80"
          stroke="#d69a77"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M425 320q35-50 64 0v22h-64z" fill="#e1ba74" />
        <circle cx="446" cy="310" r="3" fill="#4b543b" />
        <circle cx="471" cy="310" r="3" fill="#4b543b" />
        <path
          d="m451 322 7 5 7-5"
          fill="none"
          stroke="#4b543b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M112 310q-25-40-35-65 42 10 35 65M114 310q40-45 41-76-43 15-41 76"
          fill="#82936c"
        />
        <path d="M106 306h24l7 40H99z" fill="#d39b74" />
        <g fill="#8d9d72">
          <circle cx="70" cy="105" r="4" />
          <circle cx="420" cy="245" r="3" />
          <circle cx="540" cy="280" r="5" />
        </g>
      </svg>
    );
  return (
    <svg
      className={className}
      viewBox="0 0 600 430"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Lina, una luciérnaga, ilumina las piedras de un río en un bosque tranquilo"
    >
      <rect width="600" height="430" rx="28" fill="#d7e6dd" />
      <circle cx="462" cy="86" r="39" fill="#fff3c9" />
      <circle cx="481" cy="71" r="34" fill="#d7e6dd" />
      <path d="M0 265Q130 162 282 253T600 204V430H0Z" fill="#a7c0ad" />
      <path d="M0 315Q110 240 287 302T600 268V430H0Z" fill="#708f7d" />
      <path
        d="M325 264q-115 40-55 81t-3 85h142q37-43-36-86t37-80"
        fill="#b8d4cf"
      />
      <g stroke="#426853" strokeLinecap="round">
        <path d="M100 286V79M100 175 56 134M100 212l49-60" strokeWidth="16" />
        <path d="M516 292V144M515 215l39-29" strokeWidth="12" />
      </g>
      <g fill="#5d8265">
        <circle cx="84" cy="105" r="65" />
        <circle cx="45" cy="144" r="48" />
        <circle cx="130" cy="145" r="56" />
        <circle cx="514" cy="155" r="49" />
        <circle cx="549" cy="185" r="39" />
      </g>
      <g fill="#84978a">
        <ellipse cx="308" cy="301" rx="25" ry="9" />
        <ellipse cx="288" cy="334" rx="24" ry="9" />
        <ellipse cx="332" cy="366" rx="27" ry="10" />
        <ellipse cx="313" cy="404" rx="28" ry="10" />
      </g>
      <g transform="translate(322 231)">
        <ellipse
          rx="21"
          ry="17"
          fill="#edf1d0"
          transform="rotate(-28) translate(-14 -14)"
        />
        <ellipse
          rx="21"
          ry="17"
          fill="#f7f5dc"
          transform="rotate(28) translate(14 -14)"
        />
        <ellipse rx="16" ry="23" fill="#e8bb66" />
        <circle cy="-16" r="15" fill="#365e4a" />
        <circle cx="-5" cy="-18" r="2" fill="#fff" />
        <circle cx="5" cy="-18" r="2" fill="#fff" />
        <path
          d="m-4-10 4 3 4-3"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cy="13" r="9" fill="#ffeda5" />
      </g>
      <g fill="#f8e6a0">
        <circle cx="240" cy="152" r="5" />
        <circle cx="403" cy="212" r="4" />
        <circle cx="191" cy="245" r="4" />
        <circle cx="370" cy="113" r="3" />
        <circle cx="433" cy="309" r="4" />
      </g>
      <g fill="#3c614a">
        <path d="M0 430v-51q38-47 62 0 49-49 73 2 38-24 65 49z" />
        <path d="M431 430q20-70 59-42 18-58 60-13 22-35 50-15v70z" />
      </g>
      <path d="M178 352q6-26 26-15l14 13-7 11h-23z" fill="#d7b576" />
      <path
        d="m188 355-9 15m27-14 9 13"
        stroke="#d7b576"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="207" cy="344" r="2" fill="#315441" />
    </svg>
  );
}
