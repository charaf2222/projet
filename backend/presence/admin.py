from django.contrib import admin
from .models import Etudient, Enseignant, Modules, Groupe, Seances, Absence, Assister, Etat_Etudient_Module, Reconnaissance_Faciale

# Register your models here.
class EnseignantAdmin(admin.ModelAdmin):
    # Afficher uniquement les champs spécifiés
    list_display = ('id', 'Nom', 'Prenom')
    search_fields =('Nom', 'Prenom')
class ModulesAdmin(admin.ModelAdmin):
    # Afficher uniquement les champs spécifiés
    list_display = ('id', 'Nom', 'Statut')
    search_fields =('Nom', 'Statut')
class GroupeAdmin(admin.ModelAdmin):
    # Afficher uniquement les champs spécifiés
    list_display = ('id', 'Numero', 'Annee_Univ', 'Semestre')
    search_fields =('Numero', 'Annee_Univ', 'Semestre')
class SeancesAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_groupe', 'nom_module', 'nom_enseignant', 'Date', 'Heure', 'Salle')
    search_fields = ('ID_Groupe__Numero', 'ID_Module__Nom', 'ID_Enseignant__Nom', 'Date')

    def nom_groupe(self, obj):
        return str(obj.ID_Groupe.Numero) +' - '+str(obj.ID_Groupe.Annee_Univ)+' - '+obj.ID_Groupe.Semestre

    def nom_module(self, obj):
        return obj.ID_Module.Nom +' - '+ obj.ID_Module.Statut

    def nom_enseignant(self, obj):
        return obj.ID_Enseignant.Nom + ' ' + obj.ID_Enseignant.Prenom

    
class AbsenceAdmin(admin.ModelAdmin):
    # Afficher uniquement les champs spécifiés
    list_display = ('id', 'nom_etudiant', 'seances', 'Justifier')
    search_fields = ('ID_Etudient__Nom', 'ID_Etudient__Prenom', 'ID_Seances__ID_Module__Nom', 'ID_Seances__Salle', 'ID_Seances__Date')
    list_editable = ('Justifier',)  # Rendre le champ Justifier éditable dans la liste
    
    def nom_etudiant(self, obj):
        if obj.ID_Etudient:
            return obj.ID_Etudient.Nom + ' ' + obj.ID_Etudient.Prenom
        else:
            return "N/A"
    
    def seances(self, obj):
        if obj.ID_Seances:
            return obj.ID_Seances.ID_Module.Nom + ' - ' + str(obj.ID_Seances.Date) +' - '+ str(obj.ID_Seances.Heure) +' - '+ obj.ID_Seances.Salle
        else:
            return "N/A" 
class AssisterAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_etudiant', 'seances')
    search_fields = ('ID_Etudient__Nom', 'ID_Etudient__Prenom', 'ID_Seances__ID_Module__Nom', 'ID_Seances__Salle', 'ID_Seances__Date')
    
    def nom_etudiant(self, obj):
        if obj.ID_Etudient:
            return obj.ID_Etudient.Nom + ' ' + obj.ID_Etudient.Prenom
        else:
            return "N/A"
    
    def seances(self, obj):
        if obj.ID_Seances:
            return obj.ID_Seances.ID_Module.Nom + ' - ' + str(obj.ID_Seances.Date) +' - '+ str(obj.ID_Seances.Heure) +' - '+ obj.ID_Seances.Salle
        else:
            return "N/A"
class Etat_Etudient_ModuleAdmin(admin.ModelAdmin):
    # Afficher uniquement les champs spécifiés
    list_display = ('id', 'nom_etudient', 'nom_module', 'Nbr_Absence', 'Nbr_Absence_Justifier')
    search_fields =('ID_Etudient__Nom', 'ID_Etudient__Prenom', 'ID_Module__Nom', 'ID_Module__Statut')
    
    def nom_module(self, obj):
        return obj.ID_Module.Nom +' - '+ obj.ID_Module.Statut

    def nom_etudient(self, obj):
        return obj.ID_Etudient.Nom + ' ' + obj.ID_Etudient.Prenom
class EtudiantAdmin(admin.ModelAdmin):
    # Afficher uniquement les champs spécifiés
    list_display = ('id', 'Nom', 'Prenom', 'Email')
    search_fields =('Nom', 'Prenom')
    def get_changelist_form(self, request, **kwargs):
        form = super(EtudiantAdmin, self).get_changelist_form(request, **kwargs)
        form.base_fields['id'].label = 'Sélectionner un étudiant à modifier'
        return form
    
admin.site.register(Etudient, EtudiantAdmin)
admin.site.register(Enseignant, EnseignantAdmin)
admin.site.register(Modules, ModulesAdmin)
admin.site.register(Groupe, GroupeAdmin)
admin.site.register(Seances, SeancesAdmin)
admin.site.register(Absence, AbsenceAdmin)
admin.site.register(Assister, AssisterAdmin)
admin.site.register(Etat_Etudient_Module, Etat_Etudient_ModuleAdmin)
admin.site.register(Reconnaissance_Faciale)


# Personnalisation du titre de l'interface d'administration
admin.site.site_header = "Administration"
admin.site.site_title = "Administration"
admin.site.index_title = "Site de l'Administration"
