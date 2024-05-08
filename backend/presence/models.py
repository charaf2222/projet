from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
import cv2
import face_recognition
import dlib
import numpy as np
import json
from PIL import Image

class Modules(models.Model):
    CHOIX_STATUT = [
        ('td', 'TD'),
        ('tp', 'TP'),
    ]

    Nom = models.CharField(max_length=180)
    Statut = models.CharField(max_length=2, choices=CHOIX_STATUT)   

class Enseignant(AbstractUser):
    Nom = models.CharField(max_length=100)
    Prenom = models.CharField(max_length=100)
    Modules_En = models.ManyToManyField(Modules, related_name='Enseignant')

class Groupe(models.Model):
    CHOIX_SEMESTRE = [
        ('S1', 's1'),
        ('S2', 's2'),
        ('S3', 's3'),
        ('S4', 's4'),
        ('S5', 's5'),
        ('S6', 's6'),
    ]
    Numero = models.IntegerField()
    Annee_Univ = models.IntegerField()
    Semestre = models.CharField(max_length=2, choices=CHOIX_SEMESTRE)
     
class Etudient(models.Model):
    Id_Groupe = models.ForeignKey(Groupe, on_delete=models.SET_NULL, null=True)
    Nom = models.CharField(max_length=100)
    Prenom = models.CharField(max_length=100)
    Email = models.CharField(max_length=100)
    Image = models.ImageField(null=True)
    Incoding_Face = models.TextField(blank = True, null = True)
    Is_Incoded = models.BooleanField(default = False)
    
@receiver(post_save, sender=Etudient)
def extract_face_encoding(sender, instance, created, **kwargs):
    if created and instance.Is_Incoded==False:  # Check if it's a new instance and an image exists
        image = cv2.imread(instance.Image.path)

        # Convertir l'image en niveaux de gris
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Charger le classificateur Haar pour la détection de visages
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Détection des visages dans l'image
        faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.3, minNeighbors=5)

        # Dessiner des rectangles autour des visages détectés
        for (x, y, w, h) in faces:
            cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)


        face = image[y:y + h, x:x + w]
        print("c'est le face extract :__________________________")
        print("\n")
        face = Image.fromarray(face)
        face = np.asarray(face)
        print("the lenght is : ", len(face))
        print(face)
        encodages_visages = []
        visage_encoding = face_recognition.face_encodings(face)[0]
        # Ajouter les encodages à la liste
        encodages_visages.extend(visage_encoding)

        # visage_encoding = face_recognition.face_encodings (face) [0]
        # Convertir le tableau NumPy en chaîne JSON
        # Convertir la liste d'encodages en chaîne JSON
        embedding_json = json.dumps([enc.tolist() for enc in encodages_visages])
        print(embedding_json)
        # Use the first face found in the image (if multiple faces are present)
        instance.Incoding_Face = embedding_json
        instance.Is_Incoded = True
        instance.save()

class Seances(models.Model):
    choice = [
        ('8H30-10H', '8H30-10H'),
        ('10H-11H30', '10H-11H30'),
        ('11H30-13H', '11H30-13H'),
        ('14H-15H30', '14h-15H30'),
        ('15H30-17H', '15H30-17H'),
    ]
    
    ID_Groupe = models.ForeignKey(Groupe, on_delete=models.SET_NULL, null=True)
    ID_Module = models.ForeignKey(Modules, on_delete=models.SET_NULL, null=True)
    ID_Enseignant = models.ForeignKey(Enseignant, on_delete=models.SET_NULL, null=True)
    Date = models.DateField()
    Heure = models.CharField(max_length=50, choices=choice)
    Salle = models.CharField(max_length=180)
    

class Assister(models.Model):
    ID_Etudient = models.ForeignKey(Etudient, on_delete=models.SET_NULL, null=True)
    ID_Seances = models.ForeignKey(Seances, on_delete=models.SET_NULL, null=True)
    
    
    
class Absence(models.Model):
    ID_Etudient = models.ForeignKey(Etudient, on_delete=models.SET_NULL, null=True)
    ID_Seances = models.ForeignKey(Seances, on_delete=models.SET_NULL, null=True)
    Date = models.DateField()
    Justifier = models.BooleanField(default=False)
    # Méthode save() personnalisée pour stocker la valeur précédente du champ Justifier
    def save(self, *args, **kwargs):
        if self.pk:
            # Si l'objet existe déjà en base de données, stocker la valeur précédente de Justifier
            old_instance = Absence.objects.get(pk=self.pk)
            self._previous_justifier = old_instance.Justifier
        else:
            # Si l'objet est nouveau, initialiser _previous_justifier à False
            self._previous_justifier = False
        super().save(*args, **kwargs)
    # post save


# id seances 36     id etat 6 
    
class Etat_Etudient_Module(models.Model):
    ID_Etudient = models.ForeignKey(Etudient, on_delete=models.SET_NULL, null=True)
    # ID_Seances = models.ForeignKey(Seances, on_delete=models.SET_NULL, null=True)
    ID_Module = models.ForeignKey(Modules, on_delete=models.SET_NULL, null=True)
    Nbr_Absence = models.IntegerField(default=0)
    Nbr_Absence_Justifier = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('ID_Etudient', 'ID_Module')  # Cela garantit l'unicité de la paire ID_Etudient et ID_Module

    
@receiver(post_save, sender=Absence)
def increment_absence_number(sender, instance, created, **kwargs):
    if created or instance.Justifier != instance._previous_justifier:
        # Trouver ou créer l'objet Etat_Etudient_Module pour l'étudiant et le module concernés
        etat, created = Etat_Etudient_Module.objects.get_or_create(
            ID_Etudient=instance.ID_Etudient,
            ID_Module=instance.ID_Seances.ID_Module,
            defaults={'Nbr_Absence': 0, 'Nbr_Absence_Justifier': 0}
        )
        
        # Incrémenter le nombre d'absences
        etat.Nbr_Absence += 1
        
        # Si l'absence est justifiée, incrémenter aussi le nombre d'absences justifiées
        if instance.Justifier:
            etat.Nbr_Absence_Justifier += 1
        
        # Sauvegarder les modifications
        etat.save()

       
class Reconnaissance_Faciale(models.Model):
    ID_Etudient = models.ForeignKey(Etudient, on_delete=models.SET_NULL, null=True)
    Encoding_visage = models.TextField()
    
    

class CapturedImage(models.Model):
    image = models.ImageField(upload_to='captured_images/')
    capture_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image captured on {self.capture_time}"
