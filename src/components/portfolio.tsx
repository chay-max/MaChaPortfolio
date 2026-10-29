"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  User,
  BookOpen,
  LinkSimple,
  GithubLogo,
  List,
  X,
  Envelope,
  InstagramLogo,
} from "@phosphor-icons/react";
import type { Profile, Project } from "@/lib/types";
function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      style={{ opacity: 1 }}
      animate={reduced ? { y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export default function Portfolio({
  profile: p,
  projects,
}: {
  profile: Profile;
  projects: Project[];
}) {
  const [menu, setMenu] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const y = useTransform(progress, [0, 1], [0, -170]);
  const rotate = useTransform(progress, [0, 1], [0, 35]);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="light-surface">
        <header className="site-header shell">
          <Link className="wordmark" href="/" aria-label="MaCha home">
            MaCha<span>.</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className={menu ? "nav open" : "nav"}
          >
            <a href="#about" onClick={() => setMenu(false)}>
              About
            </a>
            <a href="#projects" onClick={() => setMenu(false)}>
              Projects
            </a>
            <a href="#contact" onClick={() => setMenu(false)}>
              Contact <ArrowUpRight size={15} />
            </a>
          </nav>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={menu ? "Close navigation" : "Open navigation"}
          >
            {menu ? <X size={24} /> : <List size={24} />}
          </button>
        </header>
        <main id="main">
          <section className="hero shell" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="brand-expansion">
                <b>MaCha</b>
                <span className="rule" />
                <span>Maxwell Christopher Chay</span>
              </p>
              <h1 id="hero-title">
                {p.full_name === "Maxwell Christopher Chay" ? (
                  <>
                    Maxwell
                    <br />
                    Christopher Chay<span className="period">.</span>
                  </>
                ) : (
                  p.full_name
                )}
              </h1>
              <p className="headline">{p.headline}</p>
              <p className="intro">{p.intro}</p>
              <div className="hero-actions">
                <a className="button dark" href="#projects">
                  View my work <ArrowRight size={21} />
                </a>
                <a className="button outline" href="#about">
                  Get to know me
                </a>
              </div>
              <p className="hero-footnote">
                <span className="availability-dot" />
                {p.availability}
              </p>
            </div>
            <div className="portrait-area">
              <motion.div
                aria-hidden="true"
                className="floating-orb"
                style={reduced ? {} : { y, rotate }}
              >
                <motion.div
                  animate={reduced ? {} : { y: [0, -13, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/images/glass-orb.png"
                    alt=""
                    width={180}
                    height={180}
                  />
                </motion.div>
              </motion.div>
              <figure className="portrait">
                <Image
                  src={p.photo_url}
                  alt={
                    p.photo_is_demo
                      ? "Placeholder portrait; not a photo of Maxwell"
                      : `Photo of ${p.full_name}`
                  }
                  fill
                  priority
                  sizes="(max-width: 700px) 90vw, 40vw"
                  unoptimized={!p.photo_url.startsWith("/")}
                />
                <figcaption>
                  {p.photo_is_demo
                    ? "Placeholder photo · to be replaced"
                    : p.location}
                  <span>01 / PROFILE</span>
                </figcaption>
              </figure>
              <motion.div
                className="floating-orb small"
                aria-hidden="true"
                style={reduced ? {} : { y }}
              >
                <Image
                  src="/images/glass-orb.png"
                  alt=""
                  width={90}
                  height={90}
                />
              </motion.div>
            </div>
          </section>
          <section
            id="about"
            className="bio-grid shell"
            aria-label="About Maxwell"
          >
            <Reveal className="glass bio-card reveal">
              <div className="icon-circle">
                <User size={25} />
              </div>
              <div>
                <h2>About me</h2>
                <p>{p.bio}</p>
                <span className="card-meta">{p.location}</span>
              </div>
            </Reveal>
            <Reveal className="glass bio-card reveal">
              <div className="icon-circle">
                <BookOpen size={25} />
              </div>
              <div>
                <h2>What I’m learning</h2>
                <ul className="learning-list">
                  {p.learning.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal className="glass bio-card reveal">
              <div className="icon-circle">
                <LinkSimple size={25} />
              </div>
              <div>
                <h2>Let’s connect</h2>
                <p>New ideas begin with a conversation.</p>
                <a
                  className="text-link"
                  href={p.github_url || "#contact"}
                  target={p.github_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {p.github_url ? "GitHub / chay-max" : "Get in touch"}{" "}
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </Reveal>
          </section>
        </main>
      </div>
      <div className="dark-surface">
        <section id="projects" className="projects-section shell">
          <Reveal className="section-heading reveal">
            <div>
              <p className="eyebrow">BUILT WITH CURIOSITY</p>
              <h2>
                Selected work<span>.</span>
              </h2>
            </div>
            <span className="section-note">
              Ideas, processes, and things I’ve built.
            </span>
          </Reveal>
          {projects.length === 0 ? (
            <p className="empty-state">
              New work is on the way. Check back for the story.
            </p>
          ) : (
            projects.map((project, i) => (
              <Reveal key={project.id} className="reveal">
                <Link
                  className="project-card"
                  href={`/projects/${project.slug}`}
                >
                  <div className="project-copy">
                    <p className="eyebrow">
                      {String(i + 1).padStart(2, "0")} / {project.year} ·{" "}
                      {project.role}
                    </p>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="tags">
                      {project.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <span className="project-link">
                      Explore the project <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <div className="project-image">
                    <Image
                      src={project.cover_url}
                      alt={`Illustration of ${project.title}`}
                      fill
                      sizes="(max-width: 700px) 90vw, 50vw"
                      unoptimized={!project.cover_url.startsWith("/")}
                    />
                    {project.cover_is_concept && (
                      <span className="image-note">Concept illustration</span>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))
          )}
        </section>
        <section id="contact" className="contact-section shell">
          <Reveal className="reveal">
            <p className="eyebrow">A CONVERSATION IS A GOOD START</p>
            <h2>
              Have an idea?
              <br />
              <em>Let’s talk.</em>
            </h2>
            <p>For projects, collaborations, or simply exchanging ideas.</p>
            <div className="contact-links">
              {p.email && (
                <a className="button matcha" href={`mailto:${p.email}`}>
                  <Envelope size={20} />
                  Send an email <ArrowUpRight size={18} />
                </a>
              )}
              {p.github_url && (
                <a
                  className="button ghost"
                  href={p.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubLogo size={21} />
                  GitHub <ArrowUpRight size={17} />
                </a>
              )}
              {p.instagram_url && (
                <a
                  className="button ghost"
                  href={p.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramLogo size={21} />
                  Instagram <ArrowUpRight size={17} />
                </a>
              )}
            </div>
          </Reveal>
          <p className="contact-signature">
            MaCha<span>.</span>
          </p>
        </section>
        <footer className="site-footer shell">
          <p>
            <b>MaCha</b> — Maxwell Christopher Chay
          </p>
          <span>Build. Learn. Repeat.</span>
          <a href="#main">Back to top ↑</a>
        </footer>
      </div>
    </>
  );
}
