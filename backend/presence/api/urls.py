from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ModulesViewSet, SeancesViewSet, EnseignantViewSet, GroupeViewSet, EtudientViewSet, AbsenceViewSet, AssisterViewSet, Etat_Etudient_ModuleViewSet, Reconnaissance_FacialeViewSet

presence_router = DefaultRouter()
presence_router.register(r'Modules', ModulesViewSet)
presence_router.register(r'Seances', SeancesViewSet)
presence_router.register(r'Enseignant', EnseignantViewSet)
presence_router.register(r'Groupe', GroupeViewSet)
presence_router.register(r'Etudient', EtudientViewSet)
presence_router.register(r'Absence', AbsenceViewSet)
presence_router.register(r'Assister', AssisterViewSet)
presence_router.register(r'Etat_Etudient_Module', Etat_Etudient_ModuleViewSet)
presence_router.register(r'Reconnaissance_Faciale', Reconnaissance_FacialeViewSet)
