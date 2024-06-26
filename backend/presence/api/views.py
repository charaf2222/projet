from rest_framework.viewsets import ModelViewSet
import tkinter as tk
from PIL import Image, ImageTk
import smtplib
from django.http import Http404
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from rest_framework import viewsets
from rest_framework.views import APIView
from ..models import Etudient, Enseignant, Modules, Groupe, Seances, Absence, Assister, Etat_Etudient_Module, Reconnaissance_Faciale, CapturedImage
from .serializers import ModulesSerializer, SeancesSerializer, EnseignantSerializer, GroupeSerializer, EtudientSerializer, AbsenceSerializer, AssisterSerializer, Etat_Etudient_ModuleSerializer, Reconnaissance_FacialeSerializer, CapturedImageSerializer
from django.contrib.auth import get_user_model
from PIL import Image
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
from django.http import JsonResponse
import datetime
from django.utils import timezone

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
    
 
class EnseignantOperations(APIView):
    permission_classes = [AllowAny]
    
    @csrf_exempt  # Consider CSRF protection based on your application's needs
    def post(self, request, *args, **kwargs):
        print(request.data)
        # Assuming the request's body is JSON, parse it

        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            enseignant = Enseignant.objects.get(username=username, password=password)  # Hypothétique; utilisez le hachage de mot de passe dans la pratique
            # Si trouvé, retourne le token (exemple simplifié) et l'ID de l'enseignant
            return Response({'token': 'token_fictif_pour_exemple', 'enseignantId': enseignant.id})
        except Enseignant.DoesNotExist:
            # Aucun utilisateur trouvé avec les identifiants fournis
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
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
            if not etudient.Incoding_Face:
                continue

            stored_encodings = json.loads(etudient.Incoding_Face)
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
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            encodings_data = request.data.get('encodings')
            if not encodings_data:
                return Response({'error': 'Encodings not provided'}, status=status.HTTP_400_BAD_REQUEST)

            received_encodings = json.loads(encodings_data)
            if not received_encodings:
                return Response({'error': 'Invalid or empty encodings array'}, status=status.HTTP_400_BAD_REQUEST)

            recognized_students = []
            recognized_student_ids = set()
            absent_students = []

            last_seance = Seances.objects.all().order_by('-id').first()
            students_of_group = None

            if not last_seance:
                return JsonResponse({'error': 'No seances found'}, status=400)

            if last_seance.ID_Groupe:
                students_of_group = Etudient.objects.filter(Id_Groupe=last_seance.ID_Groupe)
            else:
                return JsonResponse({'error': 'Last seance has no group associated'}, status=400)

            for face_data in received_encodings:
                face_data = np.array(face_data)
                face_image = Image.fromarray(face_data.astype('uint8'), 'RGB')
                face_data = np.array(face_image)
                face_encodings = face_recognition.face_encodings(face_data)

                if not face_encodings:
                    continue

                face_encoding = face_encodings[0]

                known_face_encodings = []
                known_face_ids = []
                known_face_names = []
                students = Etudient.objects.all()

                for student in students_of_group:
                    if student.Incoding_Face:
                        known_face_encodings.append(np.array(json.loads(student.Incoding_Face)))
                        known_face_ids.append(student.id)
                        known_face_names.append(student.Nom)

                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)

                if matches:
                    best_match_index = np.argmin(face_distances)
                    id_st = known_face_ids[best_match_index]
                    nom_st = known_face_names[best_match_index]
                    
                    etudiant = Etudient.objects.get(id=id_st)
                    recognized_student_ids.add(etudiant.id)
                    
                    if not Assister.objects.filter(ID_Etudient_id=etudiant.id, ID_Seances=last_seance).exists():
                        Assister.objects.create(ID_Etudient_id=etudiant.id, ID_Seances=last_seance)

                    student_dict = {
                        'id': etudiant.id,
                        'Nom': etudiant.Nom,
                        'Prenom': etudiant.Prenom,
                    }
                    
                    recognized_students.append(student_dict)
                else:
                    absent_students.append(etudiant)

            if recognized_students:
                return Response(recognized_students, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No matching face found'}, status=status.HTTP_404_NOT_FOUND)
   
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class MarquerAbsenceView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        
        last_seance = Seances.objects.all().order_by('-id').first()

        if not last_seance:
            return JsonResponse({'error': 'No seances found'}, status=400)

        students_of_group = Etudient.objects.filter(Id_Groupe=last_seance.ID_Groupe)
        assisted_students = Assister.objects.filter(ID_Seances=last_seance)
        
        teacher = Enseignant.objects.get(username=last_seance.ID_Enseignant)
        teacher_email = teacher.username  # Ici, l'email est stocké comme nom d'utilisateur
        teacher_password = teacher.MotDePasseApp

        server = smtplib.SMTP('smtp.gmail.com', 587)  # Utiliser 587 pour TLS
        server.starttls()
        server.login(teacher_email, teacher_password)

        for student in students_of_group:
            if student.id not in [assist.ID_Etudient_id for assist in assisted_students]:
                if not Absence.objects.filter(ID_Etudient_id=student.id, ID_Seances=last_seance).exists():
                    absence_created = Absence.objects.create(
                        ID_Etudient_id=student.id,
                        ID_Seances=last_seance,
                        Date=last_seance.Date,
                        Justifier=False
                    )
                    etat = Etat_Etudient_Module.objects.filter(
                        ID_Etudient_id=student.id,
                        ID_Module=last_seance.ID_Module
                    ).first()
                    # Préparer l'email
                    subject = 'Absent'
                    body = f"Vous êtes absent dans la séance de module : {last_seance.ID_Module.Nom} et votre nombre d'absence est: {etat.Nbr_Absence}"
                    message = MIMEText(body)
                    message['Subject'] = subject
                    message['From'] = teacher_email
                    message['To'] = student.Email

                    # Envoi de l'email
                    server.sendmail(teacher_email, student.Email, message.as_string())

        server.quit()
        return Response({'message': 'Absences marked successfully'}, status=status.HTTP_200_OK)


    
'''

// c'est le code que j'ai fait la dernier fois et il marche bien


class CompareFacesView(APIView):
    permission_classes = []  # Adjust as needed

    def post(self, request, *args, **kwargs):
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        recognized_student_ids = set()

        # Fetch the most recent Seance based on the last ID
        last_seance = Seances.objects.all().order_by('-id').first()
        if not last_seance:
            return JsonResponse({'error': 'No seances found'}, status=400)

        # Assuming you're able to identify the group of the last_seance
        if last_seance.ID_Groupe:
            # Filter students who belong to this group
            students_of_group = Etudient.objects.filter(Id_Groupe=last_seance.ID_Groupe)
        else:
            return JsonResponse({'error': 'Last seance has no group associated'}, status=400)

        def extract_face(image_path):
            image = cv2.imread(image_path)
            gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.3, minNeighbors=5)
            for (x, y, w, h) in faces:
                cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
            face = image[y:y + h, x:x + w] if faces is not None and len(faces) > 0 else None
            if face is not None:
                face = Image.fromarray(face)
                face = np.asarray(face)
                return face, faces
            return None, None

        

        try:
            cap = cv2.VideoCapture(0)
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("Unable to receive frame. Exiting...")
                    break

                cv2.imwrite('input_image.jpg', frame)
                cv2.imshow('Video Frame', frame)  # Display the live video frame

                if cv2.waitKey(1) & 0xFF == ord('q'):  # Waits 1 ms and checks if 'q' is pressed
                    break
                
                face, faces = extract_face('input_image.jpg')

                if face is not None:
                    face_encodings = face_recognition.face_encodings(face)
                    if face_encodings:
                        face_encoding = face_encodings[0]  # Consider the first face
                        known_face_encodings = []
                        known_face_ids = []

                        for etudient in students_of_group:
                            if etudient.Incoding_Face:
                                known_face_encodings.append(np.array(json.loads(etudient.Incoding_Face)))
                                known_face_ids.append(str(etudient.id))

                        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            recognized_student_id = known_face_ids[best_match_index]
                            recognized_student_ids.add(recognized_student_id)

                            if not Assister.objects.filter(ID_Etudient_id=recognized_student_id, ID_Seances=last_seance).exists():
                                Assister.objects.create(ID_Etudient_id=recognized_student_id, ID_Seances=last_seance)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        finally:
            cap.release()
            cv2.destroyAllWindows()

            # Créez des objets d'absence pour tous les étudiants non reconnus comme présents.
            for student in students_of_group:
                if str(student.id) not in recognized_student_ids:
                    Absence.objects.create(
                        ID_Etudient_id=student.id,
                        ID_Seances=last_seance,
                        Date=last_seance.Date,
                        Justifier=False
                    )

        return JsonResponse({'status': 'complete'})
'''
class AbsenceViewSet(ModelViewSet):
    queryset = Absence.objects.all()
    serializer_class = AbsenceSerializer 
    
    
class AssisterViewSet(ModelViewSet):
    queryset = Assister.objects.all()
    serializer_class = AssisterSerializer
 
 
class AssisterBySeanceAPIView(APIView):
    def get(self, request, seance_id):
        # Récupérer les objets d'assistance pour la séance donnée
        assister_objects = Assister.objects.filter(ID_Seances=seance_id)
        
        # Récupérer les objets d'absence pour la séance donnée
        absence_objects = Absence.objects.filter(ID_Seances=seance_id)
        
        

        # Liste pour stocker les données à envoyer en réponse
        data = []

        # Pour chaque objet d'assistance, récupérer le nom, le prénom et définir l'état comme "présent"
        for assister in assister_objects:
            etat_etudient_module_ = Etat_Etudient_Module.objects.filter(ID_Etudient=assister.ID_Etudient, ID_Module=assister.ID_Seances.ID_Module)
            etudiant = assister.ID_Etudient
            for et in etat_etudient_module_:
                nb_a = et.Nbr_Absence
                nb_a_j = et.Nbr_Absence_Justifier
            data.append({
                "Nom": etudiant.Nom,
                "Prenom": etudiant.Prenom,
                "Etat": "Présent", 
                "Nbr_Absence": nb_a,
                "Nbr_Absence_Justifier": nb_a_j
            })

        # Pour chaque objet d'absence, récupérer le nom, le prénom et définir l'état comme "absent"
        for absence in absence_objects:
            etat_etudient_module_ = Etat_Etudient_Module.objects.filter(ID_Etudient=absence.ID_Etudient, ID_Module=absence.ID_Seances.ID_Module)
            etudiant = absence.ID_Etudient
            for et in etat_etudient_module_:
                nb_a = et.Nbr_Absence
                nb_a_j = et.Nbr_Absence_Justifier
            data.append({
                "Nom": etudiant.Nom,
                "Prenom": etudiant.Prenom,
                "Etat": "Absent",
                "Nbr_Absence": nb_a,
                "Nbr_Absence_Justifier": nb_a_j
            })

        # Renvoyer la réponse au format JSON
        return Response(data, status=status.HTTP_200_OK)
    
class SeancesByEnseignantAPIView(APIView):
    def get(self, request, enseignant_id):
        seances_objects = Seances.objects.filter(ID_Enseignant=enseignant_id)
        serializer = SeancesSerializer(seances_objects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdministrationEmail(APIView):
    def post(self, request):
        data = json.loads(request.body)
        print(data)
        teacher_id = data.get('teacherId')
        email_content = data.get('emailContent')

        # Récupérer l'email de l'enseignant utilisé comme nom d'utilisateur
        try:
            teacher = Enseignant.objects.get(pk=teacher_id)
            teacher_email = teacher.username  # Ici, l'email est stocké comme nom d'utilisateur
            teacher_password = teacher.MotDePasseApp
            print("email ::: "+teacher_email+" password ::: "+teacher_password)
            FROM_Email = teacher_email
            TO_Email = "mecificharafeddine@gmail.com"
        except Enseignant.DoesNotExist:
            return Response({'status': 'error', 'message': 'Enseignant non trouvé'}, status=status.HTTP_404_NOT_FOUND)

        # Configuration de l'envoi de l'email
        msg = MIMEMultipart()
        msg['From'] = FROM_Email
        msg['To'] = TO_Email
        msg['Subject'] = "Correction d'erreur de présence"

        body = email_content
        msg.attach(MIMEText(body, 'plain'))

        # Configuration du serveur SMTP
        server = smtplib.SMTP('smtp.gmail.com', 587)  # Utiliser 465 pour SSL et TLS 587
        server.starttls()
        server.login(teacher_email, teacher_password)

        # Envoi de l'email
        text = msg.as_string()
        server.sendmail(FROM_Email, TO_Email, text)
        server.quit()

        return Response({'status': 'success', 'message': 'Email envoyé avec succès!'}, status=status.HTTP_200_OK)

class EtudientEmail(APIView):
    def post(self, request):
        teacher_id = request.data.get('teacherId')
        group_id = request.data.get('groupId')
        email_content = request.data.get('emailContent')

        try:
            teacher = Enseignant.objects.get(pk=teacher_id)
            groupe = Groupe.objects.get(pk=group_id)
            etudiants = Etudient.objects.filter(Id_Groupe=groupe)

            # Connexion au serveur SMTP
            server = smtplib.SMTP('smtp.gmail.com', 587)  # Utiliser 587 pour TLS
            server.starttls()
            server.login(teacher.username, teacher.MotDePasseApp)  # Connexion avec l'email et mot de passe de l'enseignant

            # Préparation de l'email
            for etudiant in etudiants:
                msg = MIMEMultipart()
                msg['From'] = teacher.username
                msg['To'] = etudiant.Email
                msg['Subject'] = "Notification pour Les Étudients de Groupe "+str(groupe.Numero)+"" 
                body = email_content
                msg.attach(MIMEText(body, 'plain'))

                text = msg.as_string()
                server.sendmail(teacher.username, etudiant.Email, text)

            server.quit()  # Déconnexion du serveur SMTP
            return Response({"message": "Emails sent successfully!"}, status=200)

        except Enseignant.DoesNotExist:
            raise Http404("Enseignant not found")
        except Groupe.DoesNotExist:
            raise Http404("Groupe not found")
        except Exception as e:
            return Response({"error": str(e)}, status=500)
               
class Etat_Etudient_ModuleViewSet(ModelViewSet):
    queryset = Etat_Etudient_Module.objects.all()
    serializer_class = Etat_Etudient_ModuleSerializer 
    
        
class Reconnaissance_FacialeViewSet(ModelViewSet):
    queryset = Reconnaissance_Faciale.objects.all()
    serializer_class = Reconnaissance_FacialeSerializer 
    
    

    
    