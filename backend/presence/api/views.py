from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets
from rest_framework.views import APIView
from ..models import Etudient, Enseignant, Modules, Groupe, Seances, Absence, Assister, Etat_Etudient_Module, Reconnaissance_Faciale, CapturedImage
from .serializers import ModulesSerializer, SeancesSerializer, EnseignantSerializer, GroupeSerializer, EtudientSerializer, AbsenceSerializer, AssisterSerializer, Etat_Etudient_ModuleSerializer, Reconnaissance_FacialeSerializer, CapturedImageSerializer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.decorators import action
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import base64
from io import BytesIO
import json
import cv2
import face_recognition
import time
import os
import numpy as np
from PIL import Image
import logging

logger = logging.getLogger(__name__)

class CaptureImageViewSet(viewsets.ModelViewSet):
    queryset = CapturedImage.objects.all()
    serializer_class = CapturedImageSerializer

    @action(detail=False, methods=['get'])
    def capture(self, request):
        cap = cv2.VideoCapture(0)  # Utilisez le numéro de périphérique correct de votre caméra
        ret, frame = cap.read()
        cap.release()

        if not ret:
            return Response({'error': 'Impossible de capturer la frame'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        _, buffer = cv2.imencode('.jpg', frame)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        print('Image Base64:', image_base64)  # Ajoutez ceci pour déboguer
        return Response({'image': image_base64})

        # Optionnel: Sauvegarder l'image capturée dans votre base de données
        # Vous aurez besoin de modifier votre modèle ou d'ajuster la logique ici pour gérer le stockage de base64 ou sous forme de fichier.
        # captured_image = CapturedImage(...)
        # captured_image.save()
    
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
    
    @api_view(['POST'])
    def compare_faces(self, request):  # Removed 'self', add if within a class
        data = json.loads(request.body)
        encodings = data.get('encodings')
        print("array :::: ", encodings)
                
        serializer = EtudientSerializer(data=request.data)
        print(serializer)

        # Assuming the POST request contains an array of face encodings
        received_encodings = request.data.get('encodings')
        if not received_encodings:
            return Response({'error': 'Encodings not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert received encodings from JSON to a NumPy array
            received_encodings = np.array(received_encodings)
            
        except Exception as e:
            return Response({'error': 'Invalid encodings format', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        closest_match = None
        min_distance = float('inf')

        for etudient in Etudient.objects.all():
            if not etudient.encoding_face:
                continue

            stored_encodings = json.loads(etudient.encoding_face)
            stored_encodings = np.array(stored_encodings)
            distance = np.linalg.norm(received_encodings - stored_encodings)

            if distance < min_distance:
                min_distance = distance
                closest_match = etudient
                
                
        if closest_match:
            serializer = self.get_serializer(closest_match)  # Adjust based on your class setup
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No matching face found'}, status=status.HTTP_404_NOT_FOUND)
 

class CompareFacesView(APIView):
    permission_classes = []  # Adjust as needed

    def post(self, request, *args, **kwargs):
        print(request.data)
        received_encodings = request.data.get('encodings')
        if not received_encodings:
            return Response({'error': 'Encodings not provided'}, status=status.HTTP_400_BAD_REQUEST)

        received_encodings = np.array(received_encodings)
        closest_match = None
        min_distance = float('inf')

        for etudient in Etudient.objects.all():
            if not etudient.encoding_face:
                continue

            stored_encodings = json.loads(etudient.encoding_face)
            stored_encodings = np.array(stored_encodings)
            distance = np.linalg.norm(received_encodings - stored_encodings)

            if distance < min_distance:
                min_distance = distance
                closest_match = etudient

        if closest_match:
            serializer = EtudientSerializer(closest_match)
            print("serialiser : ", serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No matching face found'}, status=status.HTTP_404_NOT_FOUND)

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
    
    

    
    