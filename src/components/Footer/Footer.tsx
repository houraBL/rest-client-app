import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer footer-center ">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/rss-logo.svg"
          alt="RS School icon"
          width={16}
          height={16}
        />
        RS School React course
      </a>
    </footer>
  );
}
