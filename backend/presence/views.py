from django.shortcuts import render

# Create your views here.
# views.py
from django.shortcuts import render

def face_detection_view(request):
    return render(request, 'FaceD.html')
