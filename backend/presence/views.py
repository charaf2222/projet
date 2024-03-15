from django.shortcuts import render

# Create your views here.
# views.py
from django.shortcuts import render

def webcam_view(request):
    return render(request, 'webcam.html')  # Ensure you have a template 'webcam.html' set up for webcam access and face detection
