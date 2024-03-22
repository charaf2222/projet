from rest_framework.serializers import ModelSerializer
from ..models import Etudient, Enseignant, Modules, Groupe, Seances, Absence, Assister, Etat_Etudient_Module, Reconnaissance_Faciale, CapturedImage
from django.contrib.auth import get_user_model


class CapturedImageSerializer(ModelSerializer):
    class Meta:
        model = CapturedImage
        fields = '__all__'


class ModulesSerializer(ModelSerializer):
    class Meta:
        model = Modules
        fields = ('id', 'Nom', 'Statut')
        
class SeancesSerializer(ModelSerializer):
    class Meta:
        model = Seances
        fields = ('id', 'ID_Groupe', 'ID_Module', 'ID_Enseignant', 'Date', 'Heure', 'Salle')        
        
class EnseignantSerializer(ModelSerializer):
   class Meta:
    model = get_user_model()
    fields = ['id','username', 'password', 'Nom', 'Prenom', 'Modules_En']   
        
class GroupeSerializer(ModelSerializer):
    class Meta:
        model = Groupe
        fields = ('id', 'Numero', 'Annee_Univ', 'Semestre')        
        
        
class EtudientSerializer(ModelSerializer):
    class Meta:
        model = Etudient
        fields = ('id', 'Id_Groupe', 'Nom', 'Prenom', 'Email', 'Image', 'Incoding_Face', 'Is_Incoded')    
        
        
        
class AbsenceSerializer(ModelSerializer):
    class Meta:
        model = Absence
        fields = ('id', 'ID_Etudient', 'ID_Seances', 'Date', 'Justifier')  
        
        
class AssisterSerializer(ModelSerializer):
    class Meta:
        model = Assister
        fields = ('id', 'ID_Etudient', 'ID_Seances')          
        
        
class Etat_Etudient_ModuleSerializer(ModelSerializer):
    class Meta:
        model = Etat_Etudient_Module
        fields = ('id', 'ID_Etudient', 'ID_Seances', 'ID_Module', 'Nbr_Absence', 'Nbr_Absence_Justifier')          
        
class Reconnaissance_FacialeSerializer(ModelSerializer):
    class Meta:
        model = Reconnaissance_Faciale
        fields = ('id', 'ID_Etudient', 'Encoding_visage')  