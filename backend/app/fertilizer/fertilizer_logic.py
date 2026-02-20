import pickle
import numpy as np
import pandas as pd

df = pd.read_csv("state_soil_summary.csv")
dr = pd.read_csv("dosage_recommendation.csv")

try:
    with open("fertilizer_model.pkl", "rb") as f:
        model = pickle.load(f)
except:
    model = None


def detect_deficiency(state: str):
    column = ["N", "P", "K", "OC", "B", "Cu", "Fe", "Mn", "S", "Zn"]
    row = df.loc[df["State/UT"] == state]

    if row.empty:
        raise ValueError(f"State '{state}' not found in dataset.")

    deficiency = []
    for col in column:
        value = row[col].iloc[0]
        deficiency.append(value)

    return deficiency


def fertilizer_recommendation(state: str = None, sample: np.ndarray = None):
    if state is None and sample is None:
        raise ValueError("Either state or sample must be provided.")

    if sample is not None and model is not None:
        # ML path — sample (N, P, K) takes priority
        fertilizer = ml_fertilizer(sample)
        micronutrients = ["no_micronutrient_needed"]  # no micro data from NPK alone
    else:
        # Rule-based path — state given
        deficiency = detect_deficiency(state)
        fertilizer = generalized_fertilizers(deficiency)
        micronutrients = generalized_micronutrients(deficiency)

    dosage = get_dosage(fertilizer, micronutrients)

    return {
        "fertilizer": fertilizer,
        "micronutrients": micronutrients,
        "dosage": dosage
    }


def ml_fertilizer(sample: np.ndarray):
    if model is None:
        raise ValueError("ML model not loaded.")

    proba = model.predict_proba(sample)[0]
    classes = model.classes_
    top_indices = np.argsort(proba)[::-1][:3]

    fertilizers = {}
    for i in top_indices:
        fertilizers[classes[i]] = f"{round(proba[i] * 100, 2)}%"

    return fertilizers


def generalized_fertilizers(deficiency: list):
    N, P, K, OC = deficiency[0], deficiency[1], deficiency[2], deficiency[3]

    LOW = {"very low", "low"}

    low_macro = {
        "N": N in LOW,
        "P": P in LOW,
        "K": K in LOW
    }

    low_count = sum(low_macro.values())
    fertilizer = []

    if low_count == 0:
        fertilizer.append("no fertilizer needed")

    if OC in LOW:
        if low_count >= 2:
            fertilizer.append("organic matter")
            fertilizer.append("npk_complex")
        else:
            fertilizer.append("organic matter")

    elif low_count == 3:
        fertilizer.append("npk_complex")

    elif low_macro["N"] and low_macro["P"]:
        fertilizer.append("dap")

    elif low_macro["N"] and low_macro["K"]:
        fertilizer.append("npk_complex")

    elif low_macro["N"]:
        fertilizer.append("urea")

    elif low_macro["P"]:
        fertilizer.append("ssp")

    elif low_macro["K"]:
        fertilizer.append("mop")

    else:
        fertilizer.append("no recommendation")

    return fertilizer


def generalized_micronutrients(deficiency: list):
    micro_map = {
        4: "zinc sulphate",
        5: "borax",
        6: "ferrous sulphate",
        7: "manganese sulphate",
        8: "copper sulphate",
        9: "sulphur bentonite"
    }

    micronutrients = []
    for i in range(4, len(deficiency)):
        if str(deficiency[i]).strip().lower() == "deficient":
            micronutrients.append(micro_map[i])

    if not micronutrients:
        micronutrients.append("no_micronutrient_needed")

    return micronutrients


def get_dosage(fertilizer, micronutrients):
    dosage = []

    items = list(fertilizer.keys()) if isinstance(fertilizer, dict) else fertilizer

    for fert in items:
        if fert in dr["fertilizers"].values:
            value = dr.loc[dr["fertilizers"] == fert, "Dosage"].iloc[0]
            dosage.append({fert: value})

    for micro in micronutrients:
        if micro in dr["fertilizers"].values:
            value = dr.loc[dr["fertilizers"] == micro, "Dosage"].iloc[0]
            dosage.append({micro: value})

    return dosage