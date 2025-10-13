/*
  # Configuration des politiques de stockage pour les images

  1. Politiques
    - Accès public en lecture pour toutes les images
    - Upload restreint aux utilisateurs authentifiés
    - Suppression restreinte aux utilisateurs authentifiés
    - Mise à jour restreinte aux utilisateurs authentifiés
*/

-- Mettre à jour les politiques existantes pour le bucket property-images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Politique pour l'accès public en lecture
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Politique pour l'upload d'images (utilisateurs authentifiés)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' AND
  (storage.foldername(name))[1] = 'properties'
);

-- Politique pour la mise à jour d'images (utilisateurs authentifiés)
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images')
WITH CHECK (bucket_id = 'property-images');

-- Politique pour la suppression d'images (utilisateurs authentifiés)
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');

-- Mettre à jour les paramètres du bucket pour permettre le stockage public
UPDATE storage.buckets
SET public = true
WHERE id = 'property-images';