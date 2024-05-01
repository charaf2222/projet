"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from presence.api.urls import CompareFacesView
from presence.api.views import EnseignantOperations, AssisterBySeanceAPIView, SeancesByEnseignantAPIView, MarquerAbsenceView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/reconize/', CompareFacesView.as_view()),
    path('api/stop/', MarquerAbsenceView.as_view()),
    path('api/login/', EnseignantOperations.as_view()),
    path('api/assister_by_seance/<int:seance_id>/', AssisterBySeanceAPIView.as_view()),
    path('api/seance_by_enseignant/<int:enseignant_id>/', SeancesByEnseignantAPIView.as_view()),
    path('api/', include('core.api.urls')),
   
 ]
