import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.mobilenet_v3_large(weights=None)
num_ftrs = model.classifier[-1].in_features
model.classifier[-1] = nn.Linear(num_ftrs, 4)
model.load_state_dict(torch.load("/soil_classifier_model.pt", map_location=device))
model = model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize((0.485, 0.456, 0.406),
                         (0.229, 0.224, 0.225))
])

class_names = ["Alluvial Soil", "Black Soil", "Clay Soil", "Red Soil"]

def predict_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(image)
        _, preds = torch.max(outputs, 1)
    return class_names[preds.item()]

if __name__ == "__main__":
    image_path = "D:\VS CODE\pycharm\projs\CropClassifier\img.png"
    prediction = predict_image(image_path)
    print("Predicted Soil Type:", prediction)