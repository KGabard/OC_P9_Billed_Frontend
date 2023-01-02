# OC Projet n°9 : Billed

## Objectifs
- Correction de bugs sur un projet existant
- Utilisation des devTools pour le débogage : console, inspecteur, débogeur, onglet network
- Utilisation de Jest: 
  * rapports de test,
  * taux de couverture,
  * librairies pour manipuler le DOM,
  * données et fonctions mockées
- Mise en place de tests unitaire et d'intégration
- Rédaction d'un plan de test E2E
- Utilisation d'un Kanban

## Description
Billed est une entreprise qui produit des solutions Saas destinées aux équipes de ressources humaines.
L'objet de cette mission est de deboguer et tester la fonctionnalité "note de frais".

## Technologies
Langages :
- Javascript
- HTML
- CSS

Outils :
- Jest

Librairie :
- @testing-library/jest-dom
- @testing-library/user-event
- jest-environment-jsdom

## L'architecture du projet :
### 1. Front-end
Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Pour démarrer le serveur Front-end :
```cmd
live-server
```

Pour voir le taux de code coverage:
```cmd
jest --noStackTrace --silent --coverage
```

Il est nécessaire de lancer le serveur du back-end avant de pouvoir utiliser cette application.

### 2. Back-end
Le code du back-end mis à jour est disponible : [ici](https://github.com/KGabard/OC_P9_Billed_Backend)

Pour démarrer le serveur Back-end :

```cmd
npm run run:dev
```

### 3. Comptes et utilisateurs :
Vous pouvez vous connecter en utilisant les comptes:

Administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
Employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```

## Documents Openclassrooms
- Code original du Front-end: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front
- Code original du Back-end: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

Nous avons dans le [Kanban Notion](https://www.notion.so/a7a612fc166747e78d95aa38106a55ec?v=2a8d3553379c4366b6f66490ab8f0b90):

- 4 bugs à corriger
- Des tests d'intégration à créer pour les fichier Bills.js et NewBill.js avec minimum 80% de _code coverage_ 
- Un test "End-to-end" sur le parcours employé à rédiger