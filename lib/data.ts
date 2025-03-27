export const properties = [
  {
    "id": 1,
    "nom": "Palais de l'Élysée",
    "adresse": "55 Rue du Faubourg Saint-Honoré, 75008 Paris",
    "ville": "Paris",
    "departement": "Paris",
    "region": "Île-de-France",
    "valeur": 5000000,
    "superficie": 11000,
    "type": "Palais présidentiel",
    "status": "actif",
    "ministere": "Présidence de la République",
    "niveauSecurite": "élevé",
    "telephone": "+33 1 42 92 81 00",
    "tauxOccupation": 95,
    "occupationActuelle": 285,
    "capaciteMax": 300,
    "latitude": 48.8704,
    "longitude": 2.3165,
    "image": "/palais-elysee.jpg",
    "description": "Résidence officielle du président de la République française, le Palais de l'Élysée est un monument historique majeur de Paris.",
    "installations": [
      "Salle de réception",
      "Bureaux présidentiels",
      "Bureaux administratifs",
      "Jardins",
      "Héliport",
      "Salle de conférence",
      "Centre de communication sécurisé",
      "Salle du Conseil",
      "Centre de presse",
      "Salles de réunion",
      "Centre de conférences",
      "Restaurant administratif",
      "Bibliothèque",
      "Centre de documentation",
      "Parking souterrain",
      "Amphithéâtres",
      "Cafétéria",
      "Espaces étudiants",
      "Galeries d'exposition",
      "Fontaines",
      "Boutiques",
      "Restaurants",
      "WiFi haute performance",
    ],
    "bails": [
      {
        "actif": true,
        "reference": "BAIL-2024-001",
        "locataire": "Présidence de la République",
        "surface": 11000,
        "loyer": 0,
        "dateDebut": "01/01/2024",
        "dateFin": "31/12/2027",
        "type": "Bail administratif",
        "tauxOccupation": 95,
        "occupationActuelle": 285,
        "capaciteMax": 300,
        "sous_bails": [
          {
            "reference": "SOUS-2024-001",
            "locataire": "DGFiP - Direction Generale des Finances Publiques",
            "surface": 5000,
            "loyer": 0,
            "dateDebut": "01/01/2024",
            "dateFin": "31/12/2027",
            "actif": true,
            "type": "Bail interne",
            "tauxOccupation": 90,
            "occupationActuelle": 150,
            "capaciteMax": 165,
            "description": "Direction des Grandes Entreprises",
            "installations": [
              "Bureaux administratifs",
              "Salles de réunion",
              "Centre de documentation",
              "Parking souterrain",
              "WiFi haute performance",
            ],
          },
        ],
      },
    ],
    "projets": [
      {
        "nom": "Rénovation des façades",
        "responsable": "Jean Dupont",
        "budget": 0,
        "dateDebut": "01/01/2024",
        "dateFin": "31/12/2027",
        "avancement": 35,
        "description": "Rénovation complète des façades du palais",
        "actif": true,
      },
      {
        "nom": "Modernisation des systèmes de sécurité",
        "responsable": "Marie Martin",
        "budget": 0,
        "dateDebut": "01/01/2024",
        "dateFin": "31/12/2027",
        "avancement": 45,
        "description": "Mise à niveau des systèmes de sécurité",
        "actif": true,
      },
    ],
    "taches": [
      {
        "titre": "Inspection des façades",
        "description": "Inspection détaillée de l'état des façades",
        "priorite": "haute",
        "assigneA": "Jean Dupont",
        "echeance": "15/03/2026",
        "statut": "En cours",
        "categorie": "Rénovation",
      },
      {
        "titre": "Mise à jour des systèmes de sécurité",
        "description": "Mise à jour des systèmes de surveillance",
        "priorite": "haute",
        "assigneA": "Marie Martin",
        "echeance": "30/03/2028",
        "statut": "À faire",
        "categorie": "Sécurité",
      },
    ]
  },
  {
    "id": 2,
    "nom": "Hôtel de Matignon",
    "adresse": "57 Rue de Varenne, 75007 Paris",
    "ville": "Paris",
    "departement": "Paris",
    "region": "Île-de-France",
    "valeur": 3500000,
    "superficie": 8500,
    "type": "Administratif",
    "status": "actif",
    "ministere": "Premier Ministre",
    "niveauSecurite": "élevé",
    "telephone": "01 42 75 80 00",
    "tauxOccupation": 80,
    "occupationActuelle": 680,
    "capaciteMax": 850,
    "latitude": 48.8559,
    "longitude": 2.3159,
    "image": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Matignon_gala.jpg",
    "description": "Résidence officielle et lieu de travail du Premier ministre français. Ce bâtiment historique abrite les services du Premier ministre et accueille les réunions gouvernementales.",
    "installations": [
      "Bureaux administratifs",
      "Salle du Conseil",
      "Jardins",
      "Centre de presse",
      "Salles de réunion"
    ],
    "bails": [
      {
        "reference": "MAT-2022-001",
        "locataire": "Services du Premier Ministre",
        "surface": 7500,
        "loyer": 0,
        "dateDebut": "2022-01-01",
        "dateFin": "2026-12-31",
        "actif": true
      },
      {
        "reference": "MAT-2021-002",
        "locataire": "Centre d'Analyse Stratégique",
        "surface": 350,
        "loyer": 180000,
        "dateDebut": "2021-06-01",
        "dateFin": "2028-05-31",
        "actif": true
      }
    ],
    "projets": [
      {
        "nom": "Modernisation du réseau informatique",
        "responsable": "Philippe Martin",
        "budget": 650000,
        "dateDebut": "2023-04-10",
        "dateFin": "2025-12-20",
        "avancement": 85,
        "description": "Mise à niveau de l'infrastructure réseau et renforcement de la cybersécurité.",
        "actif": true
      }
    ],
    "taches": [
      {
        "titre": "Audit énergétique",
        "description": "Évaluation de la performance énergétique du bâtiment et recommandations d'amélioration.",
        "priorite": "moyenne",
        "assigneA": "Service Technique",
        "echeance": "2026-01-15",
        "statut": "Planifié",
        "categorie": "Développement durable"
      }
    ]
  },
  {
    "id": 3,
    "nom": "Ministère de l'Économie et des Finances",
    "adresse": "139 Rue de Bercy, 75012 Paris",
    "ville": "Paris",
    "departement": "Paris",
    "region": "Île-de-France",
    "valeur": 4200000,
    "superficie": 15000,
    "type": "Administratif",
    "status": "actif",
    "ministere": "Économie",
    "niveauSecurite": "Elevé",
    "telephone": "01 40 04 04 04",
    "tauxOccupation": 90,
    "occupationActuelle": 2700,
    "capaciteMax": 3000,
    "latitude": 48.8456,
    "longitude": 2.3769,
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Minist%C3%A8re_de_l%27%C3%89conomie_et_des_Finances_Mars_2022.jpg/2560px-Minist%C3%A8re_de_l%27%C3%89conomie_et_des_Finances_Mars_2022.jpg",
    "description": "Siège du ministère de l'Économie et des Finances, également connu sous le nom de Bercy. Ce complexe moderne abrite les services financiers de l'État.",
    "installations": [
      "Bureaux administratifs",
      "Centre de conférences",
      "Restaurant administratif",
      "Bibliothèque",
      "Centre de documentation",
      "Parking souterrain"
    ],
    "bails": [
      {
        "leaseId": "FR-GOV-RE-BERCY-001",
        "title": "FR-GOV-RE-BERCY-001-60",
        "status": "Propriété Gouvernementale",
        "general": {
          "leaseDetails": {
            "type": "Bail gouvernemental",
            "primaryUse": "Administration centrale",
            "baseYear": "2023"
          },
          "financialDetails": {
            "rent": "0,00 € EUR",
            "accountingType": "Budget de l'État",
            "paymentTerms": "Alloué annuellement"
          }
        },
        "dates": {
          "start": "01/01/2020",
          "duration": "6 ans",
          "end": "01/01/2026",
          "expirationReminder": "6 mois"
        },
        "parties": {
          "tenant": {
            "organization": "République Française\\Ministère de l'Économie",
            "legalName": "Direction Générale des Finances Publiques",
            "id": "FR-DGFIP-001",
            "location": "139 Rue de Bercy, 75012 Paris"
          }
        },
        "terms": {
          "securityRequirements": [
            "Sécurité ministérielle",
            "Contrôle d'accès renforcé",
            "Protection des données sensibles",
            "Surveillance 24/7",
            "Plan de continuité d'activité"
          ]
        },
        "metadata": {
          "lastUpdated": "15/03/2025"
        },
        "sous_bails": [
          {
            "reference": "DB_1",
            "locataire": "Direction du Budget (DB)",
            "surface": 1000,
            "loyer": 0,
            "dateDebut": "01/01/2022",
            "dateFin": "31/12/2025",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 83,
            "dateDeRenouvellement": "31/06/2025"
          },
          {
            "reference": "DGFiP_1",
            "locataire": "Direction generale des Finances Publiques (DGFiP)",
            "surface": 2500,
            "loyer": 0,
            "dateDebut": "01/01/2023",
            "dateFin": "31/12/2026",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 81,
            "dateDeRenouvellement": "31/06/2025"
          },
          {
            "reference": "DGT_1",
            "locataire": "Direction generale du Trésor (DGT)",
            "surface": 1200,
            "loyer": 0,
            "dateDebut": "31/02/2022",
            "dateFin": "31/12/2027",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 92,
            "dateDeRenouvellement": "31/06/2026"
          },
          {
            "reference": "Insee_1",
            "locataire": "Institut National de la statistique et des études Economiques (Insee)",
            "surface": 2000,
            "loyer": 0,
            "dateDebut": "01/04/2024",
            "dateFin": "31/12/2027",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 76,
            "dateDeRenouvellement": "31/06/2026"
          },
          {
            "reference": "IGF_1",
            "locataire": "Inspection generale des finances (IGF)",
            "surface": 4000,
            "loyer": 0,
            "dateDebut": "01/06/2023",
            "dateFin": "31/12/2027",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 88,
            "dateDeRenouvellement": "31/06/2026"
          },
          {
            "reference": "DGCCRF_1",
            "locataire": "Direction generale de la concurrence, de la consommation et de la repression des fraudes (DGCCRF)",
            "surface": 4400,
            "loyer": 0,
            "dateDebut": "01/10/2023",
            "dateFin": "31/12/2027",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 92,
            "dateDeRenouvellement": "31/06/2026"
          }
        ]
      },
      {
        "leaseId": "FR-GOV-RE-BERCY-002",
        "title": "FR-GOV-RE-BERCY-002",
        "status": "Propriété Gouvernementale",
        "general": {
          "leaseDetails": {
            "type": "Bail gouvernemental",
            "primaryUse": "Services financiers",
            "baseYear": "2022"
          },
          "financialDetails": {
            "rent": "0,00 € EUR",
            "accountingType": "Budget de l'État",
            "paymentTerms": "Alloué annuellement"
          }
        },
        "dates": {
          "start": "01/01/2022",
          "duration": "48 mois",
          "end": "31/12/2027"
        },
        "parties": {
          "tenant": {
            "organization": "République Française\\Ministère de l'Économie",
            "legalName": "Direction Générale du Trésor",
            "id": "FR-DGT-001",
            "location": "139 Rue de Bercy, 75012 Paris"
          }
        },
        "terms": {
          "securityRequirements": [
            "Sécurité renforcée",
            "Contrôle d'accès",
            "Protection des données financières",
            "Surveillance permanente"
          ]
        },
        "metadata": {
          "lastUpdated": "20/03/2025"
        },
        "sous_bails": [
          {
            "reference": "BERCY_3E1",
            "locataire": "Direction generale du Trésor (DGT)",
            "surface": 2000,
            "loyer": 0,
            "dateDebut": "01/01/2022",
            "dateFin": "31/12/2027",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 85,
            "dateDeRenouvellement": "31/06/2026"
          },
          {
            "reference": "BERCY_3E2",
            "locataire": "Direction generale du Trésor (DGT)",
            "surface": 1500,
            "loyer": 0,
            "dateDebut": "01/01/2022",
            "dateFin": "31/12/2027",
            "actif": true,
            "type": "Bail Interne",
            "tauxOccupation": 88,
            "dateDeRenouvellement": "31/06/2026"
          }
        ]
      }
    ],
    "projets": [
      {
        "nom": "Réaménagement des espaces de travail",
        "responsable": "Sophie Dubois",
        "budget": 0,
        "dateDebut": "2023-03-15",
        "dateFin": "2027-09-15",
        "avancement": 40,
        "description": "Transformation des espaces de travail pour favoriser la collaboration et le flex office.",
        "actif": true
      }
    ],
    "taches": [
      {
        "titre": "Mise à jour du système de climatisation",
        "description": "Remplacement des unités obsolètes et optimisation de la performance énergétique.",
        "priorite": "haute",
        "assigneA": "Service Technique",
        "echeance": "2025-05-31",
        "statut": "En cours",
        "categorie": "Infrastructure"
      },
      {
        "titre": "Révision du plan de continuité d'activité",
        "description": "Actualisation des procédures en cas de crise majeure.",
        "priorite": "moyenne",
        "assigneA": "Direction Générale",
        "echeance": "2025-04-28",
        "statut": "Planifié",
        "categorie": "Gestion des risques"
      }
    ]
  },
  {
    "id": 4,
    "nom": "Université Paris-Sorbonne",
    "adresse": "1 Rue Victor Cousin, 75005 Paris",
    "ville": "Paris",
    "departement": "Paris",
    "region": "Île-de-France",
    "valeur": 3800000,
    "superficie": 12000,
    "type": "Éducation",
    "status": "actif",
    "ministere": "Éducation",
    "niveauSecurite": "faible",
    "telephone": "01 40 46 22 11",
    "tauxOccupation": 75,
    "occupationActuelle": 3000,
    "capaciteMax": 4000,
    "latitude": 48.8489,
    "longitude": 2.3417,
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Chapelle_Sainte-Ursule_de_la_Sorbonne%2C_Paris_001.jpg/1280px-Chapelle_Sainte-Ursule_de_la_Sorbonne%2C_Paris_001.jpg",
    "description": "Prestigieuse université parisienne fondée au XIIIe siècle. Ce bâtiment historique est un centre d'excellence pour les lettres et sciences humaines.",
    "installations": [
      "Amphithéâtres",
      "Bibliothèque universitaire",
      "Salles de cours",
      "Laboratoires de recherche",
      "Cafétéria",
      "Espaces étudiants"
    ],
    "bails": [],
    "projets": [
      {
        "nom": "Rénovation de la bibliothèque centrale",
        "responsable": "Claire Moreau",
        "budget": 950000,
        "dateDebut": "2023-05-15",
        "dateFin": "2024-04-30",
        "avancement": 55,
        "description": "Modernisation des espaces de lecture et amélioration de l'accessibilité.",
        "actif": true
      },
      {
        "nom": "Déploiement du WiFi haute performance",
        "responsable": "Thomas Leroy",
        "budget": 350000,
        "dateDebut": "2023-09-01",
        "dateFin": "2024-01-31",
        "avancement": 30,
        "description": "Installation d'un réseau WiFi de dernière génération dans tous les bâtiments.",
        "actif": true
      }
    ],
    "taches": [
      {
        "titre": "Inspection des toitures",
        "description": "Vérification de l'état des toitures suite aux intempéries récentes.",
        "priorite": "haute",
        "assigneA": "Service Patrimoine",
        "echeance": "2023-11-30",
        "statut": "En cours",
        "categorie": "Maintenance"
      }
    ]
  },
  {
    "id": 5,
    "nom": "Château de Versailles",
    "adresse": "Place d'Armes, 78000 Versailles",
    "ville": "Versailles",
    "departement": "Yvelines",
    "region": "Île-de-France",
    "valeur": 8000000,
    "superficie": 63000,
    "type": "Culturel",
    "status": "historique",
    "ministere": "Culture",
    "niveauSecurite": "moyen",
    "telephone": "01 30 83 78 00",
    "tauxOccupation": 60,
    "occupationActuelle": 300,
    "capaciteMax": 500,
    "latitude": 48.8049,
    "longitude": 2.1204,
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Vue_a%C3%A9rienne_du_domaine_de_Versailles_par_ToucanWings_-_Creative_Commons_By_Sa_3.0_-_083.jpg/2560px-Vue_a%C3%A9rienne_du_domaine_de_Versailles_par_ToucanWings_-_Creative_Commons_By_Sa_3.0_-_083.jpg",
    "description": "Ancienne résidence royale, le Château de Versailles est un chef-d'œuvre architectural et un symbole de l'art français du XVIIe siècle. Ce monument historique est aujourd'hui un musée national.",
    "installations": [
      "Galeries d'exposition",
      "Jardins",
      "Fontaines",
      "Centre de recherche",
      "Boutiques",
      "Restaurants"
    ],
    "bails": [
      {
        "reference": "VERS-2021-001",
        "locataire": "Restaurant La Flottille",
        "surface": 350,
        "loyer": 0,
        "dateDebut": "2021-03-01",
        "dateFin": "2027-02-28",
        "actif": true
      },
      {
        "reference": "VERS-2022-002",
        "locataire": "Boutique Souvenirs Royaux",
        "surface": 120,
        "loyer": 0,
        "dateDebut": "2022-05-01",
        "dateFin": "2027-04-30",
        "actif": true
      }
    ],
    "projets": [
      {
        "nom": "Restauration de la Galerie des Glaces",
        "responsable": "Isabelle Blanc",
        "budget": 0,
        "dateDebut": "2024-01-10",
        "dateFin": "2027-06-30",
        "avancement": 25,
        "description": "Restauration des miroirs, dorures et peintures de la célèbre Galerie des Glaces.",
        "actif": true
      },
      {
        "nom": "Réhabilitation des jardins à la française",
        "responsable": "Pierre Dumont",
        "budget": 0,
        "dateDebut": "2024-10-01",
        "dateFin": "2027-09-30",
        "avancement": 40,
        "description": "Restauration des parterres, bosquets et fontaines selon les plans historiques.",
        "actif": true
      }
    ],
    "taches": [
      {
        "titre": "Révision du système d'alarme incendie",
        "description": "Mise à niveau du système de détection et d'alarme incendie dans l'aile nord.",
        "priorite": "haute",
        "assigneA": "Service Sécurité",
        "echeance": "2025-12-15",
        "statut": "En cours",
        "categorie": "Sécurité"
      },
      {
        "titre": "Inventaire des œuvres d'art",
        "description": "Recensement et vérification de l'état des œuvres dans les réserves.",
        "priorite": "moyenne",
        "assigneA": "Conservation",
        "echeance": "2026-03-31",
        "statut": "Planifié",
        "categorie": "Patrimoine"
      },
      {
        "titre": "Étude sur l'accessibilité PMR",
        "description": "Analyse des aménagements nécessaires pour améliorer l'accessibilité aux personnes à mobilité réduite.",
        "priorite": "moyenne",
        "assigneA": "Service Technique",
        "echeance": "2026-01-31",
        "statut": "Planifié",
        "categorie": "Accessibilité"
      }
    ]
  },
  {
    "id": 6,
    "nom": "Hôtel de Toulouse",
    "adresse": "39 Rue de la Vrillière, 75001 Paris",
    "ville": "Paris",
    "departement": "Paris",
    "region": "Île-de-France",
    "valeur": 2500000,
    "superficie": 8500,
    "type": "Historique",
    "status": "actif",
    "ministere": "Économie",
    "niveauSecurite": "élevé",
    "telephone": "01 42 92 42 92",
    "tauxOccupation": 85,
    "occupationActuelle": 680,
    "capaciteMax": 800,
    "latitude": 48.8651,
    "longitude": 2.3371,
    "image": "https://upload.wikimedia.org/wikipedia/commons/5/54/P1000553_Paris_I_Rue_Croix_des_Petits-Champs_Banque_de_France_reductwk.JPG",
    "description": "Ancien palais du duc de Toulouse, aujourd'hui siège de la Banque de France.",
    "installations": [
      "Bureaux administratifs",
      "Salle de réception",
      "Salon d'honneur",
      "Archives historiques",
      "Parking privé"
    ],
    "bails": [],
    "projets": [
      {
        "nom": "Restauration des façades",
        "responsable": "Jean Morel",
        "budget": 1200000,
        "dateDebut": "2024-01-15",
        "dateFin": "2025-06-30",
        "avancement": 10,
        "description": "Travaux de restauration des façades historiques de l'Hôtel de Toulouse.",
        "actif": true
      }
    ],
    "taches": [
      {
        "titre": "Modernisation des systèmes de sécurité",
        "description": "Mise à niveau des caméras de surveillance et du contrôle d'accès.",
        "priorite": "haute",
        "assigneA": "Service Sécurité",
        "echeance": "2025-09-30",
        "statut": "En cours",
        "categorie": "Sécurité"
      }
    ]
  },
  {
    "id": 7,
    "nom": "INPI - Institut National de la Propriété Industrielle",
    "adresse": "15 Rue des Minimes, 92600 Asnières-sur-Seine",
    "ville": "Asnières-sur-Seine",
    "departement": "Hauts-de-Seine",
    "region": "Île-de-France",
    "valeur": 1800000,
    "superficie": 6000,
    "type": "Administratif",
    "status": "actif",
    "ministere": "Économie",
    "niveauSecurite": "moyen",
    "telephone": "01 56 65 89 10",
    "tauxOccupation": 80,
    "occupationActuelle": 400,
    "capaciteMax": 500,
    "latitude": 48.9098,
    "longitude": 2.2855,
    "image": "https://upload.wikimedia.org/wikipedia/commons/3/33/INPI_entrance_2022.jpg",
    "description": "Siège de l'INPI, l'organisme en charge de la protection de la propriété industrielle en France.",
    "installations": [
      "Bureaux administratifs",
      "Centre de documentation",
      "Salle de conférence",
      "Salle des archives",
      "Parking privé"
    ],
    "bails": [
      {
        "reference": "INPI-2021-003",
        "locataire": "Bureau des Brevets",
        "surface": 3000,
        "loyer": 0,
        "dateDebut": "2021-06-01",
        "dateFin": "2027-05-31",
        "actif": true
      }
    ],
    "projets": [
      {
        "nom": "Numérisation des archives",
        "responsable": "Claire Fontaine",
        "budget": 0,
        "dateDebut": "2023-05-01",
        "dateFin": "2027-12-31",
        "avancement": 60,
        "description": "Projet de digitalisation des archives de brevets et marques.",
        "actif": true
      }
    ],
    "taches": [
      {
        "titre": "Audit des infrastructures IT",
        "description": "Évaluation de l'état des serveurs et du réseau interne.",
        "priorite": "moyenne",
        "assigneA": "Départment IT",
        "echeance": "2025-07-15",
        "statut": "Planifié",
        "categorie": "Infrastructure"
      }
    ]
  },
  {
    "id": 8,
    "nom": "Centre National de la Fonction Publique Territoriale (CNFPT)",
    "adresse": "80 rue de Reuilly, 75012 Paris",
    "ville": "Paris",
    "departement": "Paris",
    "region": "Île-de-France",
    "valeur": 2000000,
    "superficie": 6500,
    "type": "Administratif",
    "status": "actif",
    "ministere": "Économie",
    "niveauSecurite": "moyen",
    "telephone": "01 55 27 44 00",
    "tauxOccupation": 70,
    "occupationActuelle": 450,
    "capaciteMax": 600,
    "latitude": 48.8472,
    "longitude": 2.3855,
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Rue_de_Reuilly_80-1.JPG/900px-Rue_de_Reuilly_80-1.JPG",
    "description": "Centre dédié à la formation et à la gestion des fonctionnaires territoriaux.",
    "installations": [
      "Salles de formation",
      "Bureaux administratifs",
      "Centre de documentation",
      "Salle de conférence"
    ],
    "bails": [],
    "projets": [],
    "taches": []
  }
]

export const departements = [
  { code: "75", nom: "Paris", region: "Île-de-France" },
  { code: "13", nom: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { code: "69", nom: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { code: "33", nom: "Gironde", region: "Nouvelle-Aquitaine" },
  { code: "59", nom: "Nord", region: "Hauts-de-France" },
  { code: "67", nom: "Bas-Rhin", region: "Grand Est" },
  { code: "31", nom: "Haute-Garonne", region: "Occitanie" },
  { code: "44", nom: "Loire-Atlantique", region: "Pays de la Loire" },
  { code: "76", nom: "Seine-Maritime", region: "Normandie" },
  { code: "38", nom: "Isère", region: "Auvergne-Rhône-Alpes" },
]

export const ministeres = [
  { id: 1, nom: "Intérieur", responsable: "Gérald Darmanin" },
  { id: 2, nom: "Économie", responsable: "Bruno Le Maire" },
  { id: 3, nom: "Éducation", responsable: "Nicole Belloubet" },
  { id: 4, nom: "Justice", responsable: "Éric Dupond-Moretti" },
  { id: 5, nom: "Culture", responsable: "Rachida Dati" },
  { id: 6, nom: "Santé", responsable: "Aurélien Rousseau" },
  { id: 7, nom: "Défense", responsable: "Sébastien Lecornu" },
  { id: 8, nom: "Présidence", responsable: "Emmanuel Macron" },
  { id: 9, nom: "Premier Ministre", responsable: "Gabriel Attal" },
]

export interface Project {
  general_information: {
    project_id: string
    project_name: string
    location: string
    status: string
    date: string
    project_type: string
    currency: string
    classification: string
    project_phase: string
    planned_start_date: string
    planned_end_date: string
  }
  key_contacts: Array<{
    role: string
    name: string
    phone: string
    email: string
  }>
  budget_information: {
    original_budget: string
    budget_changes: string
    budget_current: string
    original_commitment: string
    change_orders: string
    current_commitment: string
    paid: string
    forecast_to_complete: string
    forecast_final: string
  }
  funding_source: {
    name: string
    fiscal_year: string
    project_name: string
    committed_to_project: string
  }
  tasks: {
    total_count: number
    status: string
    completion_percentage: number
    key_tasks: string[]
    task_date_range: string
  }
  procurement: {
    proposals_count: number
    key_proposals: string[]
    bid_responses: Array<{
      vendor: string
      amount: string
      status: string
    }>
  }
}

export const palaceProject: Project = {
  general_information: {
    project_id: "PRJ-2024-001",
    project_name: "Rénovation du Palais de l'Élysée",
    location: "55 Rue du Faubourg Saint-Honoré, 75008 Paris",
    status: "En cours",
    date: "01/01/2024",
    project_type: "Rénovation majeure",
    currency: "EUR",
    classification: "Projet présidentiel",
    project_phase: "Phase 2",
    planned_start_date: "01/01/2024",
    planned_end_date: "31/12/2027"
  },
  budget_information: {
    original_budget: "0,00 € EUR",
    budget_changes: "0,00 € EUR",
    budget_current: "0,00 € EUR",
    original_commitment: "0,00 € EUR",
    change_orders: "0,00 € EUR",
    current_commitment: "0,00 € EUR",
    paid: "0,00 € EUR",
    forecast_to_complete: "0,00 € EUR",
    forecast_final: "0,00 € EUR"
  },
  funding_source: {
    name: "Budget de l'État",
    fiscal_year: "2024",
    project_name: "Le Palais de l'Elysée",
    committed_to_project: "0,00 € EUR"
  },
  tasks: {
    total_count: 4,
    status: "En cours",
    completion_percentage: 35,
    key_tasks: [
      "Rénovation des façades",
      "Mise aux normes des installations électriques",
      "Modernisation des systèmes de sécurité",
      "Rénovation des jardins"
    ],
    task_date_range: "01/01/2024 - 31/12/2027"
  },
  key_contacts: [
    {
      name: "Jean Dupont",
      role: "Chef de projet",
      phone: "+33 1 23 45 67 89",
      email: "jean.dupont@elysee.fr"
    },
    {
      name: "Marie Martin",
      role: "Architecte en chef",
      phone: "+33 1 98 76 54 32",
      email: "marie.martin@elysee.fr"
    },
    {
      name: "Pierre Durand",
      role: "Responsable sécurité",
      phone: "+33 1 45 67 89 01",
      email: "pierre.durand@elysee.fr"
    }
  ],
  procurement: {
    proposals_count: 8,
    key_proposals: [
      "Restauration de meubles historiques",
      "Installation de système de sécurité",
      "Dessin d'architecture historique"
    ],
    bid_responses: [
      {
        vendor: "Atelier Saint-Germain",
        amount: "€2,660",
        status: "Émis"
      },
      {
        vendor: "Restauration du Patrimoine",
        amount: "€3,080",
        status: "Émis"
      }
    ]
  }
}

