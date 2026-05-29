import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import KyernalLogo from './KyernalLogo';
import styles from './Landing.module.css';
import { themeCssVars } from '../lib/themeCssVars';
import { THEMES } from '../theme/landingTheme';

const NAV_LINKS = [
  { label: 'Fonctionnalités', id: 'fonctionnalites' },
  { label: 'Tarifs', id: 'tarifs' },
  { label: 'Pour les organismes', id: 'organismes' },
  { label: 'Docs', id: 'docs' },
] as const;

const FEATURES = [
  {
    title: 'Des vraies VMs, en 3 secondes',
    desc: 'Pas de simulateurs factices. Déployez de véritables environnements isolés par notre hyperviseur maison pour bidouiller vos noyaux ou configurer vos réseaux en conditions réelles.',
  },
  {
    title: "Agent d'accompagnement Vocal",
    desc: "Bloqué sur la configuration d'un reverse proxy ? Notre IA analyse votre terminal en temps réel et vous guide vocalement sans vous donner la réponse toute cuite.",
  },
  {
    title: 'Détection de frustration',
    desc: "Klixy repère les commandes répétées qui échouent. Le système ajuste la difficulté ou vous suggère une piste avant que vous n'abandonniez.",
  },
] as const;

export default function Landing() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const t = THEMES[mode];

  return (
    <div className={styles.root} style={themeCssVars(t)}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.halo} aria-hidden />

      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.brand}>
            <KyernalLogo size={20} dark={mode === 'light'} />
            <span className={styles.brandName}>Klixy</span>
          </Link>

          <div className={styles.navLinks}>
            {NAV_LINKS.map(({ label, id }) => (
              <a key={id} href={`#${id}`} className={styles.navLink}>
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
            title={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {mode === 'dark' ? '☀' : '◐'}
          </button>
          <Link to="/login" className={`${styles.btnSecondary} ${styles.navBtn}`}>
            Connexion
          </Link>
          <Link to="/" className={`${styles.btnPrimary} ${styles.navBtnPrimary}`}>
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden />
            Le moteur de micro-virtualisation Kyernal est en ligne
          </div>

          <h1 className={styles.title}>
            La pratique pure.
            <br />
            <span className={styles.titleMuted}>Oubliez les QCM.</span>
          </h1>

          <p className={styles.subtitle}>
            Klixy génère des infrastructures réelles à la volée. Préparez vos titres
            TSSR, vos certifications DevOps et vos entretiens techniques sur de
            véritables environnements Linux isolés.
          </p>

          <div className={styles.ctaRow}>
            <Link
              to="/login"
              className={`${styles.btnPrimary} ${styles.ctaBtn}`}
            >
              Lancer ma première Arena
            </Link>
            <a
              href="#fonctionnalites"
              className={`${styles.btnSecondary} ${styles.ctaBtn}`}
            >
              Voir comment ça marche
            </a>
          </div>
        </section>

        <section className={styles.demo} aria-label="Vidéo de démonstration">
          <div className={styles.demoChrome}>
            <span className={`${styles.dot} ${styles.dotRed}`} aria-hidden />
            <span className={`${styles.dot} ${styles.dotYellow}`} aria-hidden />
            <span className={`${styles.dot} ${styles.dotGreen}`} aria-hidden />
            <span className={styles.demoCmd}>kyernal --deploy arena</span>
          </div>
          <div className={styles.demoCenter}>
            <button type="button" className={styles.playBtn} aria-label="Lire la vidéo">
              <span className={styles.playTriangle} aria-hidden />
            </button>
            <span className={styles.demoLabel}>Vidéo de démonstration (30s)</span>
          </div>
        </section>

        <section id="fonctionnalites" className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Conçu pour l'apprentissage actif</h2>
            <p className={styles.sectionSub}>
              Une combinaison d'infrastructures réelles et d'accompagnement intelligent.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {FEATURES.map((feat) => (
              <article key={feat.title} className={styles.featCard}>
                <h3 className={styles.featTitle}>{feat.title}</h3>
                <p className={styles.featDesc}>{feat.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="tarifs" className={`${styles.section} ${styles.sectionNarrow}`}>
          <div className={`${styles.sectionHead} ${styles.sectionHeadTight}`}>
            <h2 className={styles.h2}>Tarification simple</h2>
          </div>

          <div className={styles.cardGrid}>
            <article className={styles.priceCard}>
              <h3 className={styles.priceName}>Découverte</h3>
              <p className={styles.priceAmount}>
                0€ <span className={styles.priceUnit}>/mois</span>
              </p>
              <ul className={styles.priceList}>
                <li>✓ 2 Arenas par mois</li>
                <li>✓ Environnements éphémères</li>
                <li>✓ Agent IA (Texte uniquement)</li>
              </ul>
              <Link to="/" className={`${styles.btnSecondary} ${styles.priceBtn}`}>
                Créer un compte
              </Link>
            </article>

            <article className={`${styles.priceCard} ${styles.priceCardPro}`}>
              <span className={styles.priceTag}>Le plus populaire</span>
              <h3 className={styles.priceName}>Apprenti Pro</h3>
              <p className={styles.priceAmount}>
                15€ <span className={styles.priceUnit}>/mois</span>
              </p>
              <ul className={styles.priceList}>
                <li>✓ Arenas illimitées</li>
                <li>✓ Persistance des environnements</li>
                <li>✓ Agent IA Vocal complet</li>
                <li>✓ Tableaux de bord de progression</li>
              </ul>
              <button type="button" className={`${styles.btnPrimary} ${styles.priceBtn}`}>
                Passer Pro
              </button>
            </article>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrand}>
              <KyernalLogo size={16} dark={mode === 'light'} />
              <span className={styles.footerBrandName}>Klixy</span>
            </div>
            <p className={styles.footerTagline}>
              L'apprentissage de l'infrastructure par la pratique réelle.
            </p>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Produit</h4>
            <div className={styles.footerLinks}>
              {['Arenas', 'Agent IA', 'Tarifs', 'Changelog'].map((label) => (
                <a key={label} href="#" className={styles.footerLink}>
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Légal</h4>
            <div className={styles.footerLinks}>
              {[
                'Mentions légales',
                'CGU',
                'CGV',
                'Politique de confidentialité',
              ].map((label) => (
                <a key={label} href="#" className={styles.footerLink}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span className={styles.copyright}>© 2026 Klixy. Tous droits réservés.</span>
          <span className={styles.hosted}>Hébergé en France · RGPD</span>
        </div>
      </footer>
    </div>
  );
}
