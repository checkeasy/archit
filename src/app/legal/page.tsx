'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  FileText,
  Shield,
  Cookie,
  Mail,
  MapPin,
  Phone,
  Building2,
  ExternalLink,
} from 'lucide-react';

/* ─────────────────────── TYPES ─────────────────────── */

type TabId = 'mentions' | 'cgv' | 'confidentialite' | 'cookies';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Scale;
}

/* ─────────────────────── DATA ─────────────────────── */

const tabs: Tab[] = [
  { id: 'mentions', label: 'Mentions légales', icon: Scale },
  { id: 'cgv', label: 'CGV', icon: FileText },
  { id: 'confidentialite', label: 'Politique de confidentialité', icon: Shield },
  { id: 'cookies', label: 'Cookies', icon: Cookie },
];

/* ─────────────────────── SECTION STYLES ─────────────────────── */

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: '#111827',
  marginBottom: 16,
  marginTop: 40,
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 10,
  marginTop: 28,
};

const paragraphStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.8,
  color: '#4B5563',
  marginBottom: 16,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 16px 0',
};

const listItemStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.8,
  color: '#4B5563',
  paddingLeft: 20,
  position: 'relative',
  marginBottom: 6,
};

const bulletStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 10,
  width: 6,
  height: 6,
  borderRadius: 9999,
  backgroundColor: '#2563EB',
};

const infoCardStyle: React.CSSProperties = {
  padding: 24,
  backgroundColor: '#F9FAFB',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  marginBottom: 20,
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#6B7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  marginBottom: 4,
};

const infoValueStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#111827',
};

const articleTitleStyle: React.CSSProperties = {
  fontSize: 19,
  fontWeight: 700,
  color: '#111827',
  marginBottom: 12,
  marginTop: 36,
  paddingBottom: 10,
  borderBottom: '1px solid #F3F4F6',
};

/* ─────────────────────── TAB CONTENT COMPONENTS ─────────────────────── */

function MentionsLegalesContent() {
  return (
    <div>
      <h2 style={{ ...sectionTitleStyle, marginTop: 0 }}>
        Mentions l&eacute;gales
      </h2>
      <p style={paragraphStyle}>
        Conform&eacute;ment aux dispositions des articles 6-III et 19 de la loi
        n&deg; 2004-575 du 21 juin 2004 pour la Confiance dans l&apos;&eacute;conomie
        num&eacute;rique, dite L.C.E.N., il est port&eacute; &agrave; la connaissance
        des utilisateurs et visiteurs du site ArchiPro les pr&eacute;sentes mentions
        l&eacute;gales.
      </p>

      {/* Éditeur du site */}
      <h3 style={sectionSubtitleStyle}>&Eacute;diteur du site</h3>
      <div style={infoCardStyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p style={infoLabelStyle}>Raison sociale</p>
            <p style={infoValueStyle}>ArchiPro SAS</p>
          </div>
          <div>
            <p style={infoLabelStyle}>Capital social</p>
            <p style={infoValueStyle}>50 000 &euro;</p>
          </div>
          <div>
            <p style={infoLabelStyle}>RCS</p>
            <p style={infoValueStyle}>Lyon B 912 345 678</p>
          </div>
          <div>
            <p style={infoLabelStyle}>SIRET</p>
            <p style={infoValueStyle}>912 345 678 00012</p>
          </div>
          <div>
            <p style={infoLabelStyle}>TVA intracommunautaire</p>
            <p style={infoValueStyle}>FR 12 912345678</p>
          </div>
          <div>
            <p style={infoLabelStyle}>Code APE</p>
            <p style={infoValueStyle}>6201Z - Programmation informatique</p>
          </div>
        </div>
      </div>

      {/* Siège social */}
      <h3 style={sectionSubtitleStyle}>Si&egrave;ge social</h3>
      <div style={infoCardStyle}>
        <div className="flex items-start gap-3">
          <MapPin size={18} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ ...infoValueStyle, marginBottom: 4 }}>
              15 rue de la R&eacute;publique
            </p>
            <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>
              69001 Lyon, France
            </p>
          </div>
        </div>
      </div>

      {/* Directeur de publication */}
      <h3 style={sectionSubtitleStyle}>Directeur de la publication</h3>
      <div style={infoCardStyle}>
        <p style={infoLabelStyle}>Nom</p>
        <p style={infoValueStyle}>Thomas Mercier, Pr&eacute;sident</p>
      </div>

      {/* Hébergeur */}
      <h3 style={sectionSubtitleStyle}>H&eacute;bergeur</h3>
      <div style={infoCardStyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p style={infoLabelStyle}>Soci&eacute;t&eacute;</p>
            <p style={infoValueStyle}>Scaleway SAS</p>
          </div>
          <div>
            <p style={infoLabelStyle}>Adresse</p>
            <p style={infoValueStyle}>8 rue de la Ville l&apos;&Eacute;v&ecirc;que, 75008 Paris</p>
          </div>
          <div>
            <p style={infoLabelStyle}>T&eacute;l&eacute;phone</p>
            <p style={infoValueStyle}>+33 1 84 13 00 00</p>
          </div>
          <div>
            <p style={infoLabelStyle}>Site web</p>
            <p style={infoValueStyle}>
              <a
                href="https://www.scaleway.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2563EB', textDecoration: 'none' }}
              >
                www.scaleway.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CNIL */}
      <h3 style={sectionSubtitleStyle}>D&eacute;claration CNIL</h3>
      <div style={infoCardStyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p style={infoLabelStyle}>Num&eacute;ro de d&eacute;claration</p>
            <p style={infoValueStyle}>n&deg; 1234567</p>
          </div>
          <div>
            <p style={infoLabelStyle}>Organisme</p>
            <p style={infoValueStyle}>
              Commission Nationale de l&apos;Informatique et des Libert&eacute;s
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <h3 style={sectionSubtitleStyle}>Contact</h3>
      <div style={infoCardStyle}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail size={16} style={{ color: '#2563EB', flexShrink: 0 }} />
            <a
              href="mailto:contact@archipro.fr"
              style={{ fontSize: 15, color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
            >
              contact@archipro.fr
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} style={{ color: '#2563EB', flexShrink: 0 }} />
            <span style={{ fontSize: 15, color: '#374151', fontWeight: 500 }}>
              04 72 00 00 00
            </span>
          </div>
        </div>
      </div>

      {/* Propriété intellectuelle */}
      <h3 style={sectionSubtitleStyle}>Propri&eacute;t&eacute; intellectuelle</h3>
      <p style={paragraphStyle}>
        L&apos;ensemble du contenu du site ArchiPro (textes, images, vid&eacute;os,
        logos, ic&ocirc;nes, sons, logiciels, etc.) est prot&eacute;g&eacute; par le
        droit d&apos;auteur, le droit des marques et le droit des bases de donn&eacute;es.
        Toute reproduction, repr&eacute;sentation, modification, publication,
        transmission ou d&eacute;naturation, totale ou partielle, du site ou de son
        contenu, par quelque proc&eacute;d&eacute; que ce soit, et sur quelque support
        que ce soit, est interdite sans l&apos;autorisation &eacute;crite pr&eacute;alable
        d&apos;ArchiPro SAS.
      </p>

      {/* Crédits */}
      <h3 style={sectionSubtitleStyle}>Cr&eacute;dits</h3>
      <p style={paragraphStyle}>
        Conception et d&eacute;veloppement : ArchiPro SAS.
        Les photographies et illustrations utilis&eacute;es sur ce site sont la
        propri&eacute;t&eacute; d&apos;ArchiPro ou utilis&eacute;es sous licence.
        Ic&ocirc;nes : Lucide Icons (licence MIT).
      </p>
    </div>
  );
}

function CGVContent() {
  return (
    <div>
      <h2 style={{ ...sectionTitleStyle, marginTop: 0 }}>
        Conditions G&eacute;n&eacute;rales de Vente
      </h2>
      <p style={paragraphStyle}>
        Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (ci-apr&egrave;s
        &laquo; CGV &raquo;) r&eacute;gissent les relations contractuelles entre ArchiPro
        SAS et tout utilisateur professionnel souscrivant &agrave; un abonnement sur la
        plateforme ArchiPro. Toute souscription implique l&apos;acceptation sans r&eacute;serve
        des pr&eacute;sentes CGV.
      </p>

      {/* Article 1 */}
      <h3 style={articleTitleStyle}>Article 1 &ndash; Objet</h3>
      <p style={paragraphStyle}>
        Les pr&eacute;sentes CGV ont pour objet de d&eacute;finir les conditions dans
        lesquelles ArchiPro SAS (ci-apr&egrave;s &laquo; le Prestataire &raquo;) fournit
        au Client un acc&egrave;s &agrave; sa plateforme de gestion en ligne
        d&eacute;di&eacute;e aux professionnels de l&apos;architecture. La plateforme
        permet la gestion de projets architecturaux, le suivi de clients, la cr&eacute;ation
        de devis et factures, la gestion documentaire et la collaboration d&apos;&eacute;quipe.
      </p>

      {/* Article 2 */}
      <h3 style={articleTitleStyle}>Article 2 &ndash; Acceptation des conditions</h3>
      <p style={paragraphStyle}>
        La cr&eacute;ation d&apos;un compte sur la plateforme ArchiPro vaut acceptation
        pleine et enti&egrave;re des pr&eacute;sentes CGV. Le Client reconna&icirc;t
        avoir pris connaissance des pr&eacute;sentes conditions avant toute souscription
        et les accepte sans r&eacute;serve. ArchiPro se r&eacute;serve le droit de
        modifier les pr&eacute;sentes CGV &agrave; tout moment. Les modifications
        entreront en vigueur d&egrave;s leur publication sur le site. Le Client sera
        inform&eacute; par email de toute modification substantielle au moins 30 jours
        avant son entr&eacute;e en vigueur.
      </p>

      {/* Article 3 */}
      <h3 style={articleTitleStyle}>Article 3 &ndash; Description des services</h3>
      <p style={paragraphStyle}>
        ArchiPro propose une plateforme SaaS (Software as a Service) offrant les
        fonctionnalit&eacute;s suivantes :
      </p>
      <ul style={listStyle}>
        {[
          'Gestion de projets architecturaux avec suivi par phases (Esquisse, APS, APD, PRO, DCE, ACT, DET, AOR, Livraison)',
          'CRM intégré pour la gestion des clients (particuliers, professionnels, marchés publics)',
          'Création et gestion de devis professionnels avec calcul automatique de la TVA',
          'Génération de factures conformes à la législation française',
          'Gestion documentaire avec versioning et partage sécurisé',
          'Planning et calendrier avec synchronisation externe',
          'Messagerie intégrée et collaboration d’équipe',
          'Rapports et analyses de performance',
        ].map((item) => (
          <li key={item} style={listItemStyle}>
            <span style={bulletStyle} />
            {item}
          </li>
        ))}
      </ul>
      <p style={paragraphStyle}>
        Les fonctionnalit&eacute;s disponibles varient selon le plan souscrit (Solo, Pro,
        Cabinet). Le d&eacute;tail des fonctionnalit&eacute;s incluses dans chaque plan
        est disponible sur la page{' '}
        <Link href="/pricing" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
          Tarifs
        </Link>
        .
      </p>

      {/* Article 4 */}
      <h3 style={articleTitleStyle}>Article 4 &ndash; Tarifs et paiement</h3>
      <p style={paragraphStyle}>
        Les prix des abonnements sont indiqu&eacute;s en euros hors taxes (HT) sur la
        page Tarifs du site. La TVA applicable est celle en vigueur au jour de la
        facturation (20 % pour les prestations de services num&eacute;riques).
      </p>
      <p style={paragraphStyle}>
        Le paiement s&apos;effectue par carte bancaire (Visa, Mastercard, American Express)
        via notre prestataire de paiement s&eacute;curis&eacute; Stripe. La facturation
        est mensuelle ou annuelle selon l&apos;option choisie par le Client. En cas de
        facturation annuelle, une r&eacute;duction de 20 % est appliqu&eacute;e.
      </p>
      <p style={paragraphStyle}>
        Tout retard de paiement entra&icirc;ne de plein droit l&apos;application de
        p&eacute;nalit&eacute;s de retard calcul&eacute;es au taux d&apos;int&eacute;r&ecirc;t
        l&eacute;gal major&eacute; de 5 points, ainsi qu&apos;une indemnit&eacute;
        forfaitaire de recouvrement de 40 euros conform&eacute;ment &agrave; l&apos;article
        L.441-6 du Code de commerce.
      </p>

      {/* Article 5 */}
      <h3 style={articleTitleStyle}>Article 5 &ndash; Dur&eacute;e et r&eacute;siliation</h3>
      <p style={paragraphStyle}>
        L&apos;abonnement est souscrit pour une dur&eacute;e mensuelle ou annuelle selon
        le choix du Client, renouvelable par tacite reconduction. Le Client peut
        r&eacute;silier son abonnement &agrave; tout moment depuis son espace personnel,
        rubrique &laquo; Param&egrave;tres &gt; Facturation &raquo;. La r&eacute;siliation
        prend effet &agrave; la fin de la p&eacute;riode de facturation en cours.
      </p>
      <p style={paragraphStyle}>
        En cas de r&eacute;siliation, le Client conserve l&apos;acc&egrave;s &agrave; son
        compte jusqu&apos;&agrave; la fin de la p&eacute;riode pay&eacute;e. Les
        donn&eacute;es du Client sont conserv&eacute;es pendant 90 jours apr&egrave;s
        la fin de l&apos;abonnement, d&eacute;lai pendant lequel le Client peut exporter
        l&apos;int&eacute;gralit&eacute; de ses donn&eacute;es. Pass&eacute; ce d&eacute;lai,
        les donn&eacute;es sont d&eacute;finitivement supprim&eacute;es.
      </p>
      <p style={paragraphStyle}>
        ArchiPro se r&eacute;serve le droit de suspendre ou r&eacute;silier l&apos;acc&egrave;s
        du Client en cas de manquement aux pr&eacute;sentes CGV, notamment en cas de
        d&eacute;faut de paiement apr&egrave;s mise en demeure rest&eacute;e infructueuse
        pendant 15 jours, ou en cas d&apos;utilisation abusive de la plateforme.
      </p>

      {/* Article 6 */}
      <h3 style={articleTitleStyle}>Article 6 &ndash; Responsabilit&eacute;</h3>
      <p style={paragraphStyle}>
        ArchiPro s&apos;engage &agrave; fournir un service disponible 99,9 % du temps
        (hors maintenances programm&eacute;es). En cas d&apos;indisponibilit&eacute;
        d&eacute;passant ce seuil sur un mois calendaire, le Client pourra demander une
        compensation sous forme d&apos;avoir.
      </p>
      <p style={paragraphStyle}>
        La responsabilit&eacute; d&apos;ArchiPro ne pourra &ecirc;tre engag&eacute;e
        qu&apos;en cas de faute prouv&eacute;e et sera limit&eacute;e au montant des
        sommes vers&eacute;es par le Client au cours des 12 mois pr&eacute;c&eacute;dant
        le fait g&eacute;n&eacute;rateur. En aucun cas, ArchiPro ne pourra &ecirc;tre
        tenu responsable des dommages indirects, tels que perte de chiffre d&apos;affaires,
        perte de donn&eacute;es, pr&eacute;judice commercial ou atteinte &agrave;
        l&apos;image.
      </p>

      {/* Article 7 */}
      <h3 style={articleTitleStyle}>Article 7 &ndash; Propri&eacute;t&eacute; intellectuelle</h3>
      <p style={paragraphStyle}>
        La plateforme ArchiPro, son code source, ses algorithmes, son design et
        l&apos;ensemble de ses contenus sont la propri&eacute;t&eacute; exclusive
        d&apos;ArchiPro SAS et sont prot&eacute;g&eacute;s par les lois fran&ccedil;aises
        et internationales sur la propri&eacute;t&eacute; intellectuelle.
      </p>
      <p style={paragraphStyle}>
        Le Client reste propri&eacute;taire de l&apos;ensemble des donn&eacute;es qu&apos;il
        saisit sur la plateforme (projets, documents, informations clients, etc.).
        ArchiPro ne revendique aucun droit de propri&eacute;t&eacute; sur les contenus
        du Client et s&apos;interdit toute utilisation de ces donn&eacute;es en dehors
        de la fourniture du service.
      </p>

      {/* Article 8 */}
      <h3 style={articleTitleStyle}>Article 8 &ndash; Protection des donn&eacute;es</h3>
      <p style={paragraphStyle}>
        ArchiPro s&apos;engage &agrave; traiter les donn&eacute;es personnelles du Client
        conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection
        des Donn&eacute;es (RGPD) et &agrave; la loi Informatique et Libert&eacute;s.
        Les d&eacute;tails du traitement des donn&eacute;es sont d&eacute;crits dans
        notre Politique de confidentialit&eacute;, accessible depuis cette m&ecirc;me
        page.
      </p>
      <p style={paragraphStyle}>
        Les donn&eacute;es du Client sont h&eacute;berg&eacute;es exclusivement en France
        sur des serveurs de Scaleway SAS, certifi&eacute;s ISO 27001. Les transferts de
        donn&eacute;es hors de l&apos;Union Europ&eacute;enne sont strictement interdits
        sans le consentement explicite du Client.
      </p>

      {/* Article 9 */}
      <h3 style={articleTitleStyle}>Article 9 &ndash; Droit applicable et juridiction comp&eacute;tente</h3>
      <p style={paragraphStyle}>
        Les pr&eacute;sentes CGV sont r&eacute;gies par le droit fran&ccedil;ais. Tout
        litige relatif &agrave; l&apos;interpr&eacute;tation ou &agrave; l&apos;ex&eacute;cution
        des pr&eacute;sentes conditions sera soumis aux tribunaux comp&eacute;tents de
        Lyon, m&ecirc;me en cas de pluralit&eacute; de d&eacute;fendeurs ou d&apos;appel
        en garantie.
      </p>
      <p style={paragraphStyle}>
        Pr&eacute;alablement &agrave; toute action judiciaire, les parties s&apos;engagent
        &agrave; rechercher une solution amiable. Tout r&eacute;clamation devra &ecirc;tre
        adress&eacute;e par &eacute;crit &agrave; l&apos;adresse{' '}
        <a href="mailto:contact@archipro.fr" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
          contact@archipro.fr
        </a>{' '}
        ou par courrier au si&egrave;ge social d&apos;ArchiPro.
      </p>

      <div
        style={{
          padding: 20,
          backgroundColor: '#EFF6FF',
          borderRadius: 12,
          border: '1px solid #DBEAFE',
          marginTop: 32,
        }}
      >
        <p style={{ fontSize: 14, color: '#1E40AF', fontWeight: 500, margin: 0, lineHeight: 1.7 }}>
          Derni&egrave;re mise &agrave; jour des CGV : 1er f&eacute;vrier 2026. Les
          pr&eacute;sentes CGV sont applicables &agrave; compter de cette date pour
          toute nouvelle souscription.
        </p>
      </div>
    </div>
  );
}

function ConfidentialiteContent() {
  return (
    <div>
      <h2 style={{ ...sectionTitleStyle, marginTop: 0 }}>
        Politique de confidentialit&eacute;
      </h2>
      <p style={paragraphStyle}>
        ArchiPro SAS accorde une importance primordiale &agrave; la protection de vos
        donn&eacute;es personnelles. La pr&eacute;sente politique de confidentialit&eacute;
        a pour objectif de vous informer sur la mani&egrave;re dont nous collectons,
        traitons et prot&eacute;geons vos donn&eacute;es conform&eacute;ment au
        R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es
        (RGPD - R&egrave;glement UE 2016/679) et &agrave; la loi Informatique et
        Libert&eacute;s du 6 janvier 1978 modifi&eacute;e.
      </p>

      {/* Données collectées */}
      <h3 style={sectionSubtitleStyle}>Donn&eacute;es collect&eacute;es</h3>
      <p style={paragraphStyle}>
        Dans le cadre de l&apos;utilisation de la plateforme ArchiPro, nous sommes
        amen&eacute;s &agrave; collecter les cat&eacute;gories de donn&eacute;es
        suivantes :
      </p>

      <div style={infoCardStyle}>
        <div className="flex flex-col gap-5">
          <div>
            <p style={{ ...infoLabelStyle, color: '#2563EB' }}>Donn&eacute;es d&apos;identification</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Nom, pr&eacute;nom, adresse email professionnelle, num&eacute;ro de
              t&eacute;l&eacute;phone, nom du cabinet, adresse postale, num&eacute;ro
              SIRET.
            </p>
          </div>
          <div>
            <p style={{ ...infoLabelStyle, color: '#2563EB' }}>Donn&eacute;es de projets</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Informations relatives aux projets architecturaux (descriptions, phases,
              documents, plans, rendus 3D), informations clients, devis et factures.
            </p>
          </div>
          <div>
            <p style={{ ...infoLabelStyle, color: '#2563EB' }}>Donn&eacute;es de connexion</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Adresse IP, type de navigateur, syst&egrave;me d&apos;exploitation, pages
              visit&eacute;es, dur&eacute;e de visite, identifiants de session.
            </p>
          </div>
          <div>
            <p style={{ ...infoLabelStyle, color: '#2563EB' }}>Donn&eacute;es de paiement</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Les informations de carte bancaire sont trait&eacute;es directement par
              notre prestataire Stripe et ne sont jamais stock&eacute;es sur nos serveurs.
            </p>
          </div>
        </div>
      </div>

      {/* Finalités du traitement */}
      <h3 style={sectionSubtitleStyle}>Finalit&eacute;s du traitement</h3>
      <p style={paragraphStyle}>
        Vos donn&eacute;es personnelles sont collect&eacute;es et trait&eacute;es pour
        les finalit&eacute;s suivantes :
      </p>
      <ul style={listStyle}>
        {[
          'Fourniture et gestion du service ArchiPro (création de compte, accès aux fonctionnalités)',
          'Gestion de la relation client et support technique',
          'Facturation et gestion des paiements',
          'Établissement de statistiques anonymisées d’utilisation du service',
          'Amélioration continue de la plateforme et de l’expérience utilisateur',
          'Communication d’informations relatives au service (mises à jour, maintenance)',
          'Respect des obligations légales et réglementaires',
        ].map((item) => (
          <li key={item} style={listItemStyle}>
            <span style={bulletStyle} />
            {item}
          </li>
        ))}
      </ul>

      {/* Base légale */}
      <h3 style={sectionSubtitleStyle}>Base l&eacute;gale du traitement</h3>
      <div style={infoCardStyle}>
        <div className="flex flex-col gap-4">
          <div>
            <p style={{ ...infoLabelStyle, color: '#059669' }}>Ex&eacute;cution du contrat</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Le traitement est n&eacute;cessaire &agrave; l&apos;ex&eacute;cution du
              contrat d&apos;abonnement auquel le Client a souscrit.
            </p>
          </div>
          <div>
            <p style={{ ...infoLabelStyle, color: '#059669' }}>Consentement</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Pour les communications commerciales et les cookies non essentiels, le
              traitement est fond&eacute; sur votre consentement explicite, que vous
              pouvez retirer &agrave; tout moment.
            </p>
          </div>
          <div>
            <p style={{ ...infoLabelStyle, color: '#059669' }}>Int&eacute;r&ecirc;t l&eacute;gitime</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              L&apos;am&eacute;lioration de nos services et la s&eacute;curit&eacute;
              de la plateforme reposent sur notre int&eacute;r&ecirc;t l&eacute;gitime.
            </p>
          </div>
          <div>
            <p style={{ ...infoLabelStyle, color: '#059669' }}>Obligation l&eacute;gale</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Certaines donn&eacute;es sont conserv&eacute;es pour r&eacute;pondre &agrave;
              nos obligations fiscales et comptables.
            </p>
          </div>
        </div>
      </div>

      {/* Durée de conservation */}
      <h3 style={sectionSubtitleStyle}>Dur&eacute;e de conservation</h3>
      <ul style={listStyle}>
        {[
          'Données de compte : pendant la durée de l’abonnement + 90 jours après résiliation',
          'Données de facturation : 10 ans (obligations comptables)',
          'Données de connexion : 12 mois (obligations légales)',
          'Données de support : 3 ans après la clôture du ticket',
          'Cookies : durée maximale de 13 mois',
        ].map((item) => (
          <li key={item} style={listItemStyle}>
            <span style={bulletStyle} />
            {item}
          </li>
        ))}
      </ul>

      {/* Droits des utilisateurs */}
      <h3 style={sectionSubtitleStyle}>Vos droits</h3>
      <p style={paragraphStyle}>
        Conform&eacute;ment au RGPD, vous disposez des droits suivants sur vos
        donn&eacute;es personnelles :
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: 20 }}>
        {[
          {
            title: 'Droit d’accès',
            desc: 'Obtenir la confirmation que vos données sont traitées et en recevoir une copie.',
          },
          {
            title: 'Droit de rectification',
            desc: 'Faire corriger vos données personnelles inexactes ou incomplètes.',
          },
          {
            title: 'Droit de suppression',
            desc: 'Demander l’effacement de vos données dans les conditions prévues par le RGPD.',
          },
          {
            title: 'Droit à la portabilité',
            desc: 'Recevoir vos données dans un format structuré et couramment utilisé.',
          },
          {
            title: 'Droit d’opposition',
            desc: 'Vous opposer au traitement de vos données pour des motifs légitimes.',
          },
          {
            title: 'Droit à la limitation',
            desc: 'Demander la limitation du traitement dans certaines circonstances.',
          },
        ].map((right) => (
          <div
            key={right.title}
            style={{
              padding: 16,
              backgroundColor: '#F9FAFB',
              borderRadius: 10,
              border: '1px solid #E5E7EB',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              {right.title}
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
              {right.desc}
            </p>
          </div>
        ))}
      </div>
      <p style={paragraphStyle}>
        Pour exercer vos droits, contactez notre D&eacute;l&eacute;gu&eacute; &agrave;
        la Protection des Donn&eacute;es (DPO) &agrave; l&apos;adresse{' '}
        <a href="mailto:dpo@archipro.fr" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
          dpo@archipro.fr
        </a>
        . Nous nous engageons &agrave; r&eacute;pondre dans un d&eacute;lai de 30 jours.
      </p>

      {/* Sous-traitants */}
      <h3 style={sectionSubtitleStyle}>Sous-traitants</h3>
      <p style={paragraphStyle}>
        Pour fournir notre service, nous faisons appel aux sous-traitants suivants,
        chacun offrant des garanties ad&eacute;quates en mati&egrave;re de protection
        des donn&eacute;es :
      </p>
      <div style={infoCardStyle}>
        <div className="flex flex-col gap-4">
          {[
            {
              name: 'Scaleway SAS',
              role: 'Hébergement des données',
              location: 'France (Paris, DC3/DC5)',
            },
            {
              name: 'Stripe Inc.',
              role: 'Traitement des paiements',
              location: 'Union Européenne (Dublin)',
            },
            {
              name: 'Postmark (ActiveCampaign)',
              role: 'Envoi d’emails transactionnels',
              location: 'Union Européenne',
            },
            {
              name: 'Plausible Analytics',
              role: 'Analytiques web (sans cookies)',
              location: 'Union Européenne',
            },
          ].map((sub) => (
            <div key={sub.name} className="flex items-start gap-4">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: '#EFF6FF',
                  flexShrink: 0,
                }}
              >
                <Building2 size={16} style={{ color: '#2563EB' }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                  {sub.name}
                </p>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                  {sub.role} &ndash; {sub.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact DPO */}
      <h3 style={sectionSubtitleStyle}>Contact DPO</h3>
      <div
        style={{
          padding: 24,
          backgroundColor: '#EFF6FF',
          borderRadius: 12,
          border: '1px solid #DBEAFE',
        }}
      >
        <div className="flex items-start gap-4">
          <Shield size={24} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
              D&eacute;l&eacute;gu&eacute; &agrave; la Protection des Donn&eacute;es
            </p>
            <p style={{ fontSize: 14, color: '#4B5563', marginBottom: 8, lineHeight: 1.6 }}>
              Pour toute question relative &agrave; la protection de vos donn&eacute;es
              personnelles ou pour exercer vos droits, vous pouvez contacter notre DPO :
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail size={14} style={{ color: '#2563EB' }} />
                <a
                  href="mailto:dpo@archipro.fr"
                  style={{ fontSize: 14, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
                >
                  dpo@archipro.fr
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color: '#2563EB' }} />
                <span style={{ fontSize: 14, color: '#374151' }}>
                  ArchiPro SAS &ndash; DPO, 15 rue de la R&eacute;publique, 69001 Lyon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RGPD compliance note */}
      <div
        style={{
          padding: 20,
          backgroundColor: '#ECFDF5',
          borderRadius: 12,
          border: '1px solid #BBF7D0',
          marginTop: 28,
        }}
      >
        <p style={{ fontSize: 14, color: '#166534', fontWeight: 500, margin: 0, lineHeight: 1.7 }}>
          En cas de r&eacute;clamation non satisfaite, vous avez &eacute;galement le
          droit d&apos;introduire une r&eacute;clamation aupr&egrave;s de la CNIL
          (Commission Nationale de l&apos;Informatique et des Libert&eacute;s) &ndash;{' '}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#166534', fontWeight: 600 }}
          >
            www.cnil.fr
          </a>
        </p>
      </div>
    </div>
  );
}

function CookiesContent() {
  return (
    <div>
      <h2 style={{ ...sectionTitleStyle, marginTop: 0 }}>
        Politique relative aux cookies
      </h2>
      <p style={paragraphStyle}>
        La pr&eacute;sente politique vous informe sur l&apos;utilisation de cookies et
        technologies similaires sur le site ArchiPro, conform&eacute;ment &agrave; la
        directive europ&eacute;enne 2002/58/CE (&laquo; ePrivacy &raquo;) et aux
        recommandations de la CNIL.
      </p>

      <h3 style={sectionSubtitleStyle}>Qu&apos;est-ce qu&apos;un cookie ?</h3>
      <p style={paragraphStyle}>
        Un cookie est un petit fichier texte d&eacute;pos&eacute; sur votre terminal
        (ordinateur, tablette, smartphone) lors de votre visite sur notre site.
        Il permet de stocker des informations relatives &agrave; votre navigation
        et de vous reconna&icirc;tre lors de vos visites ult&eacute;rieures.
      </p>

      {/* Cookies essentiels */}
      <h3 style={sectionSubtitleStyle}>Cookies essentiels</h3>
      <div style={infoCardStyle}>
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: 12 }}
        >
          <div
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: '#DCFCE7',
              color: '#166534',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Toujours actifs
          </div>
        </div>
        <p style={{ ...paragraphStyle, marginBottom: 12 }}>
          Ces cookies sont indispensables au fonctionnement du site et ne peuvent
          pas &ecirc;tre d&eacute;sactiv&eacute;s. Ils sont g&eacute;n&eacute;ralement
          d&eacute;finis en r&eacute;ponse &agrave; vos actions (connexion, remplissage
          de formulaires, pr&eacute;f&eacute;rences de confidentialit&eacute;).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              name: 'session_token',
              desc: 'Maintien de votre session de connexion',
              duration: 'Session',
            },
            {
              name: 'csrf_token',
              desc: 'Protection contre les attaques CSRF',
              duration: 'Session',
            },
            {
              name: 'cookie_consent',
              desc: 'Mémorisation de vos préférences cookies',
              duration: '12 mois',
            },
            {
              name: 'security_flags',
              desc: 'Vérification de sécurité du compte',
              duration: '24 heures',
            },
          ].map((cookie) => (
            <div
              key={cookie.name}
              style={{
                padding: 14,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2, fontFamily: 'monospace' }}>
                {cookie.name}
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 4px 0' }}>
                {cookie.desc}
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                Dur&eacute;e : {cookie.duration}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cookies analytiques */}
      <h3 style={sectionSubtitleStyle}>Cookies analytiques</h3>
      <div style={infoCardStyle}>
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: 12 }}
        >
          <div
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: '#EFF6FF',
              color: '#1E40AF',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Respectueux de la vie priv&eacute;e
          </div>
        </div>
        <p style={{ ...paragraphStyle, marginBottom: 12 }}>
          Nous utilisons <strong>Plausible Analytics</strong>, une solution
          d&apos;analyse web respectueuse de la vie priv&eacute;e, conforme au
          RGPD et qui <strong>ne d&eacute;pose aucun cookie</strong> sur votre
          terminal. Plausible ne collecte aucune donn&eacute;e personnelle et
          ne suit pas les utilisateurs d&apos;un site &agrave; l&apos;autre.
        </p>
        <div
          style={{
            padding: 14,
            backgroundColor: '#ffffff',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
          }}
        >
          <div className="flex items-start gap-3">
            <Shield size={16} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                Pourquoi Plausible ?
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Contrairement &agrave; Google Analytics, Plausible est
                h&eacute;berg&eacute; en Europe, ne d&eacute;pose pas de cookies,
                ne collecte pas d&apos;adresses IP et est enti&egrave;rement conforme
                au RGPD sans n&eacute;cessiter de banni&egrave;re de consentement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cookies fonctionnels */}
      <h3 style={sectionSubtitleStyle}>Cookies fonctionnels</h3>
      <div style={infoCardStyle}>
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: 12 }}
        >
          <div
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: '#FFF7ED',
              color: '#9A3412',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Optionnels
          </div>
        </div>
        <p style={{ ...paragraphStyle, marginBottom: 12 }}>
          Ces cookies permettent d&apos;am&eacute;liorer votre exp&eacute;rience en
          m&eacute;morisant vos pr&eacute;f&eacute;rences. Ils ne sont d&eacute;pos&eacute;s
          qu&apos;avec votre consentement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              name: 'user_preferences',
              desc: 'Langue, thème, vue par défaut du tableau de bord',
              duration: '12 mois',
            },
            {
              name: 'sidebar_state',
              desc: 'Position et état de la barre latérale',
              duration: '6 mois',
            },
            {
              name: 'recent_projects',
              desc: 'Accès rapide aux derniers projets consultés',
              duration: '30 jours',
            },
            {
              name: 'notification_prefs',
              desc: 'Préférences de notifications',
              duration: '12 mois',
            },
          ].map((cookie) => (
            <div
              key={cookie.name}
              style={{
                padding: 14,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2, fontFamily: 'monospace' }}>
                {cookie.name}
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 4px 0' }}>
                {cookie.desc}
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                Dur&eacute;e : {cookie.duration}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Gérer vos cookies */}
      <h3 style={sectionSubtitleStyle}>Comment g&eacute;rer vos cookies</h3>
      <p style={paragraphStyle}>
        Vous pouvez &agrave; tout moment modifier vos pr&eacute;f&eacute;rences en
        mati&egrave;re de cookies. Voici comment proc&eacute;der :
      </p>
      <ul style={listStyle}>
        {[
          'Sur ArchiPro : utilisez le panneau de gestion des cookies accessible via le lien « Paramètres cookies » en bas de chaque page.',
          'Sur votre navigateur : vous pouvez configurer votre navigateur pour refuser les cookies. Consultez la documentation de votre navigateur pour connaître la procédure.',
          'Chrome : Paramètres > Confidentialité et sécurité > Cookies et autres données de site',
          'Firefox : Paramètres > Vie privée et sécurité > Cookies et données de sites',
          'Safari : Préférences > Confidentialité > Cookies et données de sites web',
          'Edge : Paramètres > Cookies et autorisations de site',
        ].map((item) => (
          <li key={item} style={listItemStyle}>
            <span style={bulletStyle} />
            {item}
          </li>
        ))}
      </ul>

      <div
        style={{
          padding: 20,
          backgroundColor: '#FFF7ED',
          borderRadius: 12,
          border: '1px solid #FED7AA',
          marginTop: 20,
        }}
      >
        <p style={{ fontSize: 14, color: '#9A3412', fontWeight: 500, margin: 0, lineHeight: 1.7 }}>
          <strong>Attention :</strong> la d&eacute;sactivation des cookies essentiels peut
          emp&ecirc;cher le bon fonctionnement du site ArchiPro, notamment la connexion
          &agrave; votre compte et la navigation s&eacute;curis&eacute;e.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── MAIN PAGE COMPONENT ─────────────────────── */

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<TabId>('mentions');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mentions':
        return <MentionsLegalesContent />;
      case 'cgv':
        return <CGVContent />;
      case 'confidentialite':
        return <ConfidentialiteContent />;
      case 'cookies':
        return <CookiesContent />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* ==================== HEADER / NAV ==================== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}
        >
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                backgroundColor: '#2563EB',
                borderRadius: 8,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              A
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#111827' }}>ArchiPro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
            >
              Fonctionnalit&eacute;s
            </Link>
            <Link
              href="/pricing"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
            >
              Tarifs
            </Link>
            <Link
              href="/contact"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 8,
              }}
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#ffffff',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: 8,
                backgroundColor: '#2563EB',
              }}
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section
        style={{
          padding: '80px 24px 48px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '6px 16px',
              borderRadius: 9999,
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 32,
              border: '1px solid #DBEAFE',
            }}
          >
            <Scale size={14} />
            Transparence et conformit&eacute;
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 20,
            }}
          >
            Informations{' '}
            <span style={{ color: '#2563EB' }}>l&eacute;gales</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: '#6B7280',
              maxWidth: 560,
              margin: '0 auto 12px',
            }}
          >
            Retrouvez l&apos;ensemble de nos informations l&eacute;gales, conditions
            g&eacute;n&eacute;rales de vente, politique de confidentialit&eacute; et
            gestion des cookies.
          </p>

          <p style={{ fontSize: 14, color: '#9CA3AF' }}>
            Derni&egrave;re mise &agrave; jour : 1er f&eacute;vrier 2026
          </p>
        </div>
      </section>

      {/* ==================== TAB NAVIGATION ==================== */}
      <section style={{ padding: '0 24px' }}>
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div
            className="flex items-center gap-0 overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                  style={{
                    padding: '16px 20px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2563EB' : '#6B7280',
                    borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s, border-color 0.2s',
                    marginBottom: -1,
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== TAB CONTENT ==================== */}
      <section style={{ padding: '48px 24px 96px' }}>
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: 20,
            border: '1px solid #E5E7EB',
            padding: 'clamp(24px, 4vw, 48px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {renderTabContent()}
        </div>
      </section>

      {/* ==================== CONTACT CTA ==================== */}
      <section
        style={{
          padding: '64px 24px',
          backgroundColor: '#F9FAFB',
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 16,
            }}
          >
            Une question sur nos mentions l&eacute;gales ?
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 1.7 }}>
            Notre &eacute;quipe est disponible pour r&eacute;pondre &agrave; toutes vos
            questions relatives &agrave; la protection de vos donn&eacute;es et &agrave;
            nos conditions d&apos;utilisation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2"
              style={{
                padding: '14px 32px',
                backgroundColor: '#2563EB',
                color: '#ffffff',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
              }}
            >
              <Mail size={16} />
              Nous contacter
            </Link>
            <a
              href="mailto:dpo@archipro.fr"
              className="inline-flex items-center gap-2"
              style={{
                padding: '14px 32px',
                backgroundColor: '#ffffff',
                color: '#374151',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                border: '1px solid #D1D5DB',
              }}
            >
              <ExternalLink size={16} />
              Contacter le DPO
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={{ padding: '64px 24px 32px', backgroundColor: '#111827' }}>
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            paddingBottom: 48,
            borderBottom: '1px solid #1F2937',
          }}
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#2563EB',
                  borderRadius: 8,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                A
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#ffffff' }}>ArchiPro</span>
            </div>
            <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>
              La plateforme de gestion pour les architectes.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Produit
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <Link
                  href="/features"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Fonctionnalit&eacute;s
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  D&eacute;mo
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Ressources
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  API
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* L&eacute;gal */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              L&eacute;gal
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <Link
                  href="/legal"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Mentions l&eacute;gales
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  CGV
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Confidentialit&eacute;
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Contact
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <a
                  href="mailto:contact@archipro.fr"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  contact@archipro.fr
                </a>
              </li>
              <li>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>04 72 00 00 00</span>
              </li>
              <li>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>Lyon, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            &copy; 2026 ArchiPro. Tous droits r&eacute;serv&eacute;s.
          </p>
        </div>
      </footer>
    </div>
  );
}
