import torch
from torchvision import models
import torch.nn as nn
from pathlib import Path

def load_model(model_path: str, num_classes: int):

    model_path = Path(model_path)
    if not model_path.exists():
        raise FileNotFoundError(f"model not found at path {model_path}")


    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = models.mobilenet_v3_large(weights = None)
    num_ftrs = model.classifier[-1].in_features
    model.classifier[-1] = nn.Linear(num_ftrs , num_classes)

    model.load_state_dict(torch.load(model_path, map_location= device ))
    model = model.to(device)
    model.eval()

    return model, device