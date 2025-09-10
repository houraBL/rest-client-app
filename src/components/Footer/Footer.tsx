import Image from 'next/image';
import Link from 'next/link';

const TEAM_MEMBERS = [
  { name: 'alinidi', githubLink: 'https://github.com/alinidi' },
  { name: 'AleksandrKlesh', githubLink: 'https://github.com/AleksandrKlesh' },
  { name: 'houraBL', githubLink: 'https://github.com/houraBL' },
];

const MENTORS = [
  { name: 'AleksandroSN', githubLink: 'https://github.com/AleksandroSN' },
  { name: 'vyach-g', githubLink: 'https://github.com/vyach-g' },
  { name: 'ffriday', githubLink: 'https://github.com/ffriday' },
];

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside>
        <Link
          className="flex gap-4 flex-col hover:underline hover:underline-offset-4"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/rss-logo.svg"
            alt="RS School icon"
            width={50}
            height={50}
            className="fill-current"
          />
          <p>
            RS School React course
            <br />
            2025
          </p>
        </Link>
      </aside>
      <nav>
        <h6 className="footer-title">Our Team</h6>
        {TEAM_MEMBERS.map((member) => (
          <Link
            key={member.name}
            className="link link-hover flex flex-row gap-2"
            href={member.githubLink}
          >
            <Image
              src="/icon-github.svg"
              className="h-6"
              alt="GitHub logo"
              width={32}
              height={32}
            />
            {member.name}
          </Link>
        ))}
      </nav>
      <nav>
        <h6 className="footer-title">Our Mentors</h6>
        {MENTORS.map((mentor) => (
          <Link
            key={mentor.name}
            className="link link-hover flex flex-row gap-2"
            href={mentor.githubLink}
          >
            <Image
              src="/icon-github.svg"
              className="h-6"
              alt="GitHub logo"
              width={32}
              height={32}
            />
            {mentor.name}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
