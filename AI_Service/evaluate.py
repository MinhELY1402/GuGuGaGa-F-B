"""
Đánh giá mô hình food_classifier.pth trên tập kiểm thử (test set) — tạo bằng chứng cho
tiêu chí nghiệm thu WBS 1.6.2 (Top-1 >= 80%, Top-3 >= 92%, latency CPU <= 500ms/ảnh).

Cách dùng:
    python evaluate.py --data-dir <dataset> [--split test] [--weights models/food_classifier.pth]

<dataset>/<split>/ phải có cấu trúc ImageFolder (mỗi lớp một thư mục, cùng thứ tự với train).
Kết quả được ghi ra models/eval_report.json để đưa vào báo cáo.
"""
import argparse
import json
import os
import time
from datetime import datetime, timezone

import torch
import torch.nn as nn
from torchvision import datasets, transforms
from torchvision.models import mobilenet_v2


def build_model(num_classes, weights_path, device):
    model = mobilenet_v2()
    model.classifier = nn.Sequential(nn.Dropout(p=0.3), nn.Linear(1280, num_classes))
    model.load_state_dict(torch.load(weights_path, map_location=device))
    return model.to(device).eval()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--split", default="test")
    parser.add_argument("--weights", default=os.path.join("models", "food_classifier.pth"))
    parser.add_argument("--out", default=os.path.join("models", "eval_report.json"))
    args = parser.parse_args()

    device = torch.device("cpu")  # đo latency trên CPU theo tiêu chí nghiệm thu
    tfm = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    dataset = datasets.ImageFolder(os.path.join(args.data_dir, args.split), tfm)
    model = build_model(len(dataset.classes), args.weights, device)

    top1 = top3 = 0
    latencies = []
    per_class = {c: [0, 0] for c in dataset.classes}  # [đúng, tổng]
    with torch.no_grad():
        for img, label in dataset:
            start = time.perf_counter()
            logits = model(img.unsqueeze(0))
            latencies.append((time.perf_counter() - start) * 1000)
            top = logits.topk(3, dim=1).indices[0].tolist()
            cls = dataset.classes[label]
            per_class[cls][1] += 1
            if top[0] == label:
                top1 += 1
                per_class[cls][0] += 1
            if label in top:
                top3 += 1

    n = len(dataset)
    latencies.sort()
    report = {
        "evaluated_at": datetime.now(timezone.utc).isoformat(),
        "weights": args.weights,
        "weights_size_mb": round(os.path.getsize(args.weights) / 1e6, 2),
        "split": args.split,
        "num_images": n,
        "top1_accuracy": round(top1 / n, 4),
        "top3_accuracy": round(top3 / n, 4),
        "latency_ms_cpu": {
            "mean": round(sum(latencies) / n, 1),
            "p95": round(latencies[int(0.95 * (n - 1))], 1),
        },
        "per_class_top1": {c: round(ok / tot, 4) if tot else None for c, (ok, tot) in per_class.items()},
        "acceptance": {
            "top1_ge_80": top1 / n >= 0.80,
            "top3_ge_92": top3 / n >= 0.92,
            "size_le_15mb": os.path.getsize(args.weights) <= 15e6,
            "latency_p95_le_500ms": latencies[int(0.95 * (n - 1))] <= 500,
        },
    }
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(json.dumps({k: v for k, v in report.items() if k != "per_class_top1"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
