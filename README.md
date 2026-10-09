# Album de mariage — Les Mille & Une Nuits

Site statique en français : carrousel automatique, album, commandes tactiles et mise en page responsive. Les images utilisent les photos présentes à la racine du dossier. Les fichiers d'origine ne sont pas convertis : le site sert leur résolution native.

## Ajouter la musique

Déposez votre morceau, que vous êtes autorisé à diffuser, dans `assets/` et nommez-le `musique-mariage.mp3`. Le navigateur demande un clic pour lancer la lecture : la musique en lecture automatique avec son est bloquée par les navigateurs. Le carrousel, lui, défile automatiquement toutes les 5,5 secondes.

## Publier sur GitHub Pages

1. Créez un dépôt GitHub et ajoutez-y le contenu de ce dossier, y compris les photos et `assets/musique-mariage.mp3`.
2. Dans le dépôt, ouvrez **Settings → Pages**.
3. Sous **Build and deployment**, choisissez **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)` ; enregistrez.
4. GitHub Pages affichera l'adresse publique une fois le déploiement terminé.

Toutes les photos du dossier sont des originaux JPEG de plusieurs mégaoctets. Leur résolution sera conservée à l'affichage, mais les photos ne sont pas agrandies artificiellement à la 4K : la taille réelle dépend de chaque fichier. Pensez à vérifier la taille totale du dépôt avant l'envoi.
