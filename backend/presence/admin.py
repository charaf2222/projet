from django.contrib import admin
from .models import Etudient, Enseignant, Modules, Groupe, Seances, Absence, Assister, Etat_Etudient_Module, Reconnaissance_Faciale

# Register your models here.

admin.site.register(Etudient)
admin.site.register(Enseignant)
admin.site.register(Modules)
admin.site.register(Groupe)
admin.site.register(Seances)
admin.site.register(Absence)
admin.site.register(Assister)
admin.site.register(Etat_Etudient_Module)
admin.site.register(Reconnaissance_Faciale)
