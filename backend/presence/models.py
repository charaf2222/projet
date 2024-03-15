from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver


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
    # post save


@receiver(post_save, sender=Absence)
def incrimentAbsenceNumber(sender, instence, created, **kwargs):
    if created:
        etat = Etat_Etudient_Module.objects.get_or_create(ID_Etudiant=instence.ID_Etudiant, ID_Module=instence.ID_Seances.ID_Module)
        etat.Nbr_Absence += 1
        etat.save()    

    
    
class Etat_Etudient_Module(models.Model):
    ID_Etudient = models.ForeignKey(Etudient, on_delete=models.SET_NULL, null=True)
    # ID_Seances = models.ForeignKey(Seances, on_delete=models.SET_NULL, null=True)
    ID_Module = models.ForeignKey(Modules, on_delete=models.SET_NULL, null=True)
    Nbr_Absence = models.IntegerField(default=0)
    Nbr_Absence_Justifier = models.IntegerField(default=0)
    
    

class Reconnaissance_Faciale(models.Model):
    ID_Etudient = models.ForeignKey(Etudient, on_delete=models.SET_NULL, null=True)
    Encoding_visage = models.TextField()