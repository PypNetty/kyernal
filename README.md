# Klixy

> Vous formez à distance. Mais vous ne voyez rien. Klixy change ça.

Klixy est la plateforme de labs pratiques IT accessible depuis le navigateur, pilotée par la voix et les agents IA. Hébergée en France, conforme RGPD, pensée pour les certifications professionnelles françaises.

---

## Le problème

En formation IT à distance, les apprenants pratiquent chez eux. Les formateurs ne voient rien. Qui a vraiment fait les exercices ? Qui bloque depuis 2 heures sans oser demander ? Personne ne sait.

Les apprenants bricolent avec VirtualBox, flingent leurs PC, et arrivent en examen sans avoir jamais pratiqué dans de bonnes conditions.

Les organismes Qualiopi doivent justifier que leurs apprenants pratiquent vraiment. Aujourd'hui ils ne peuvent pas le prouver.

---

## La solution

```
L'apprenant arrive sur arena.klixy.fr
        ↓
"Bonjour Thomas, content de te retrouver.
Tu as un nouveau ticket qui t'attend."
        ↓
VM Debian 13 clonée en moins de 3 secondes
Incident injecté automatiquement
        ↓
Interface split :
├── Gauche : terminal SSH (Xterm.js) + onglet web GLPI
└── Droite : ticket + consignes + bouton micro IA
        ↓
L'apprenant résout en parlant à l'agent
L'agent exécute les commandes dans la VM
        ↓
"Problème résolu en 18 minutes. Score : 94%"
        ↓
Métriques capturées en JSONB — mine d'or pour Klixy Edu et Klixy Pro
```

Zéro installation. Zéro formulaire. Juste la pratique.

---

## Les modules

### Klixy Arena — `arena.klixy.fr`
Labs pratiques en conditions réelles pour les apprenants.

- Accueil vocal personnalisé sans compte (cookie)
- VM Linux provisionnée automatiquement via API Proxmox
- Incidents injectés par l'IA (Apache cassé, port fermé, MySQL mal configuré...)
- Terminal SSH interactif dans le navigateur (Xterm.js)
- Résolution vocale — l'apprenant parle, l'agent exécute dans la VM
- Validation automatique des objectifs via script SSH
- Métriques de session capturées en JSONB

### Klixy Edu — `edu.klixy.fr`
Tableau de bord pédagogique pour les formateurs et organismes.

- Vue en temps réel sur chaque apprenant
- Rapport vocal instantané ("où en sont mes apprenants ?")
- Historique des commandes, Hesitation Index, erreurs critiques
- Traçabilité pédagogique complète — argument Qualiopi
- Gestion de promos, données supprimées en fin de formation

### Klixy Pro — `pro.klixy.fr`
Évaluation technique pour les recruteurs.

- Le recruteur crée un test technique réaliste
- Le candidat reçoit un lien — VM prête en 30 secondes
- Rapport complet : score d'autonomie, aisance vocale, commandes tapées
- Replay de la session complète

---

## Certifications ciblées

- TSSR — Technicien Supérieur Systèmes et Réseaux
- DWWM — Développeur Web et Web Mobile
- AIS — Administrateur d'Infrastructures Sécurisées
- Bachelor DevOps
- CDA — Concepteur Développeur d'Applications

---

## Modèle économique

| Offre | Public | Tarif |
|---|---|---|
| Gratuit | Apprenant individuel | 2h/mois, 1 lab Linux |
| Pro | Apprenant individuel | 12€/mois |
| Pro + Windows | Apprenant individuel | 17€/mois |
| Organisme | AFPA, Studi, CFA, OpenClassrooms... | Sur devis |
| Recruteur | Test unitaire | 29-49€/test |
| Recruteur | Abonnement illimité | 299€/mois |

---

## Roadmap

### POC — Juillet 2026

**Klixy Arena uniquement** — prouver que le concept fonctionne.

- Accueil vocal personnalisé sans auth (cookie)
- Agent IA vocal (Voxtral STT + Mistral Small 4 + Voxtral TTS)
- VM Linux clonée en moins de 3 secondes via API Proxmox
- Incidents injectés automatiquement par l'IA
- Terminal SSH interactif (Xterm.js) — pas de Guacamole
- Résolution vocale — l'agent exécute les commandes dans la VM
- Validation automatique via script SSH
- Métriques JSONB capturées en base

### MVP — Septembre 2026

- Authentification OIDC (compte persistant)
- **Klixy Edu** — dashboard formateur complet
- Prise de main à distance
- Notification automatique au formateur
- Paiement en ligne (Stripe)
- Matchmaking Arena entre apprenants

### v1 — Début 2027

- **Klixy Pro** — évaluation recruteurs
- Gestion de promos
- Chat éphémère RGPD natif
- Labs Windows Server en option
- Support N1 100% automatisé

---

## Architecture

```
Pilier 1 — Backend (VPS France)
├── Site React (arena.klixy.fr)
├── Caddy (reverse proxy + SSL)
├── Backend Go (WebSocket audio, proxy SSH, API Proxmox)
└── PostgreSQL

Pilier 2 — Bastion (VPS France)
└── Jump Host SSH — seul point d'entrée vers l'hyperviseur

Pilier 3 — Hyperviseur (OVH KS-5-B, 64Go RAM)
├── Proxmox VE 9 (KVM)
├── Templates Debian 13 cloud-init
├── VMs apprenants isolées (SDN Proxmox)
└── Apt-Cacher-NG (cache apt local)
```

---

## Stack IA

- **LLM** — Mistral Small 4 (function calling, orchestration)
- **STT** — Voxtral Mini Transcribe Realtime (streaming WebSocket)
- **TTS** — Voxtral TTS
- **Hébergement IA** — France, RGPD natif

Un fondateur. Des agents IA. Hébergé en France.

---

## Statut

🧪 POC Klixy Arena en cours de développement — juillet 2026.

---

## Contact

- Site : [klixy.fr](https://klixy.fr) *(à venir)*
- LinkedIn : [PypNetty](https://linkedin.com/in/pypnetty)
- GitHub : [github.com/PypNetty](https://github.com/PypNetty)