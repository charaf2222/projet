from django.urls import path, include
from rest_framework.routers import DefaultRouter
from presence.api.urls import presence_router


router = DefaultRouter()

router.registry.extend(presence_router.registry)

urlpatterns = [
    path('', include(router.urls)),
]

