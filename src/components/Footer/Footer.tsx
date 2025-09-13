import { MENTORS, TEAM_MEMBERS } from '@/constants/constants';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Footer');
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
            {t('course')}
            <br />
            2025
          </p>
        </Link>
      </aside>
      <nav>
        <h6 className="footer-title">{t('team')}</h6>
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
        <h6 className="footer-title">{t('mentors')}</h6>
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
