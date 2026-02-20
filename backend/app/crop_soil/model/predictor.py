import torch
from torchvision import transforms
from PIL import Image

from .config import Class_name

def predict(model,device,image: Image.Image, class_names: list):

    image = image.convert("RGB")

    transform = transforms.Compose([
        transforms.Resize((224,224)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5),
                                 (0.5, 0.5, 0.5))
        ])

    image_tensor = transform(image)
    image_tensor = image_tensor.unsqueeze(0).to(device)


    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)

    predicted_class = Class_name[predicted_idx.item()]
    confidence = confidence.item() * 100

    return predicted_class, confidence