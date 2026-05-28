export default function CloudSvg() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 w-full h-full z-0"
      viewBox="0 0 500 920"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g style={{ animation: "floatSlow 8s ease-in-out infinite" }}>
        <path
          d="M410 55 C430 25, 480 15, 500 55 C520 35, 565 45, 555 85 C575 75, 600 105, 565 130 C585 150, 555 185, 520 165 C530 195, 485 205, 465 175 C445 195, 405 185, 415 155 C395 165, 375 135, 395 115 C375 95, 395 55, 410 55Z"
          stroke="#5A67D8"
          strokeWidth="1.2"
          opacity="0.22"
        />
      </g>
      <g style={{ animation: "float 6s ease-in-out infinite 1s" }}>
        <path
          d="M-35 260 C-15 230, 35 218, 50 258 C68 238, 115 248, 105 288 C125 278, 148 308, 118 328 C138 348, 108 378, 78 358 C88 388, 42 398, 22 368 C2 388, -28 368, -18 338 C-38 348, -62 318, -42 298 C-62 278, -42 248, -35 260Z"
          stroke="#5A67D8"
          strokeWidth="1.2"
          opacity="0.18"
        />
      </g>
      <g style={{ animation: "floatSlow 9s ease-in-out infinite 2s" }}>
        <path
          d="M455 410 C475 380, 525 368, 540 408 C560 388, 605 398, 595 438 C615 428, 638 458, 605 478 C625 498, 595 528, 560 508 C570 538, 530 548, 510 518 C490 538, 448 528, 458 498 C438 508, 418 478, 438 458 C418 438, 435 408, 455 410Z"
          stroke="#5A67D8"
          strokeWidth="1.2"
          opacity="0.18"
        />
      </g>
      <g style={{ animation: "float 7s ease-in-out infinite 0.5s" }}>
        <path
          d="M-25 715 C-5 685, 45 673, 60 713 C78 693, 125 703, 115 743 C135 733, 158 763, 128 783 C148 803, 118 833, 88 813 C98 843, 52 853, 32 823 C12 843, -18 823, -8 793 C-28 803, -55 773, -35 753 C-55 733, -35 703, -25 715Z"
          stroke="#5A67D8"
          strokeWidth="1.2"
          opacity="0.18"
        />
      </g>
      <g style={{ animation: "floatSlow 10s ease-in-out infinite 3s" }}>
        <path
          d="M375 795 C395 765, 445 753, 460 793 C480 773, 525 783, 515 823 C535 813, 558 843, 525 863 C545 883, 515 913, 485 893 C495 923, 448 933, 428 903 C408 923, 368 913, 378 883 C358 893, 338 863, 358 843 C338 823, 358 793, 375 795Z"
          stroke="#5A67D8"
          strokeWidth="1.2"
          opacity="0.18"
        />
      </g>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes floatSlow { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(0.5deg)} }
      `}</style>
    </svg>
  );
}
