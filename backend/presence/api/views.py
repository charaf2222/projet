from rest_framework.viewsets import ModelViewSet
from ..models import Etudient, Enseignant, Modules, Groupe, Seances, Absence, Assister, Etat_Etudient_Module, Reconnaissance_Faciale
from .serializers import ModulesSerializer, SeancesSerializer, EnseignantSerializer, GroupeSerializer, EtudientSerializer, AbsenceSerializer, AssisterSerializer, Etat_Etudient_ModuleSerializer, Reconnaissance_FacialeSerializer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from rest_framework import status
import cv2
import face_recognition

class ModulesViewSet(ModelViewSet):
    queryset = Modules.objects.all()
    serializer_class = ModulesSerializer
    
    @api_view(['POST'])
    def create_module(request):
        
        serializer = ModulesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @api_view(['PUT'])
    def update_module(request, pk):
        try:
            module = Modules.objects.get(pk=pk)
        except Modules.DoesNotExist:
            return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ModulesSerializer(module, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @api_view(['DELETE'])
    def delete_module(request, pk):
        try:
            module = Modules.objects.get(pk=pk)
        except Modules.DoesNotExist:
            return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)
        
        module.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SeancesViewSet(ModelViewSet):
    queryset = Seances.objects.all()
    serializer_class = SeancesSerializer
 
class EnseignantViewSet(ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = EnseignantSerializer
    
    @api_view(['POST'])
    @permission_classes([AllowAny])
    def signup(request):
        if request.method == "POST":
            serializer = EnseignantSerializer(data=request.data)
            username = request.data.get("username")
            password1 = request.data.get("password")
            if serializer.is_valid():
                Enseignant = get_user_model()
                enseignant = Enseignant.objects.create_user(username=username, password=password1)
                enseignant.Nom = request.data.get("Nom")
                enseignant.Prenom = request.data.get("Prenom")
                enseignant.Modules_En.set(request.data.getlist("Modules_En"))
                enseignant.save()
                # serializer.save()
                return Response({"message": "Utilisateur inscrit avec succès"})
            else:
                return Response({"erreur": serializer.errors}, status=400)
        else:
            return Response({"erreur": "Method not allowed"}, status=405) 
    

    @api_view(['GET'])
    @permission_classes([AllowAny])
    def enseignant_operations(request):
        action = request.query_params.get('action', '').lower()

        if action == 'login' and request.method == 'GET':
            username = request.data.get('username')
            password = request.data.get('password')

            user = authenticate(request, username=username, password=password)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key})
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # Other operations...

        else:
            return Response({'error': 'Invalid action or method'}, status=status.HTTP_400_BAD_REQUEST)
    
    @api_view(['PUT', 'DELETE'])
    @permission_classes([IsAuthenticated])
    def update_or_delete(request, user_id):
        user = get_user_model().objects.filter(id=user_id).first()

        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            serializer = EnseignantSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        else:
            return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)    
        
class GroupeViewSet(ModelViewSet):
    queryset = Groupe.objects.all()
    serializer_class = GroupeSerializer       
    
class EtudientViewSet(ModelViewSet):
    queryset = Etudient.objects.all()
    serializer_class = EtudientSerializer
 
class AbsenceViewSet(ModelViewSet):
    queryset = Absence.objects.all()
    serializer_class = AbsenceSerializer 
    
    
class AssisterViewSet(ModelViewSet):
    queryset = Assister.objects.all()
    serializer_class = AssisterSerializer
 
class Etat_Etudient_ModuleViewSet(ModelViewSet):
    queryset = Etat_Etudient_Module.objects.all()
    serializer_class = Etat_Etudient_ModuleSerializer 
    
        
class Reconnaissance_FacialeViewSet(ModelViewSet):
    queryset = Reconnaissance_Faciale.objects.all()
    serializer_class = Reconnaissance_FacialeSerializer 
    
    

    
    