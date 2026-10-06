# LiverGuard

**Explainable NAFLD risk prediction for education and research demonstration.**

LiverGuard is an end-to-end machine-learning web application that estimates NAFLD risk from routine health markers and explains which features influenced the result. It combines a stacking ensemble with SHAP-based feature contributions in a responsive web interface.

> LiverGuard is an educational prototype, not a medical diagnostic device or a substitute for professional medical advice.

## Live application

- Web app: https://liverguard.vercel.app
- Repository: https://github.com/Ayush-Hassan07/LiverGuard

## What it uses

The prediction form collects 12 markers:

- Age, height, weight, and BMI
- Fasting blood sugar
- ALT and AST
- LDL, HDL, triglycerides, and total cholesterol
- Diabetes diagnosis status

Height and all other form fields are required. BMI is calculated from height and weight.

## Architecture

```text
Browser
  │
  ▼
Next.js + TypeScript frontend (Vercel)
  │
  ▼
ASP.NET Core API (Render)
  │
  ▼
FastAPI ML service (Render)
  │
  ▼
Preprocessing + ensemble models + SHAP explanations
```

The browser communicates with the ASP.NET API. The API validates requests and calls the ML service; the ML service is the single source of truth for preprocessing and inference.

## Model methodology

The ensemble combines:

- Logistic Regression
- Random Forest
- XGBoost
- A Logistic Regression stacking meta-model

Base-model probabilities are combined by the meta-model and evaluated against the selected decision threshold. SHAP contributions identify which features pushed an individual prediction higher or lower. Contribution scores are not percentages, causal effects, or direct medical risk changes.

## Reported performance

Held-out test metrics from the project model:

| Metric | Result |
| --- | ---: |
| Accuracy | 98.88% |
| ROC-AUC | 0.9950 |
| Macro F1 | 0.8204 |
| Class 0 recall | 80.00% |
| Class 1 recall | 99.13% |
| Decision threshold | 0.78 |

These results describe the project dataset and are not clinical validation.

## Privacy and limitations

LiverGuard is designed as a stateless educational application. The current version does not create user accounts, patient profiles, prediction history, or saved health records. Submitted values are used for the active request and are not intentionally persisted by the application.

The system has not undergone prospective clinical validation, may not generalize equally across populations, and cannot replace clinical evaluation, laboratory interpretation, imaging, diagnosis, or treatment advice.

## Technology stack

- **Frontend:** Next.js, React, TypeScript, CSS, Lucide React
- **Backend:** ASP.NET Core, C#, REST API, HttpClient, CORS
- **ML service:** Python, FastAPI, scikit-learn, XGBoost, SHAP, NumPy, pandas
- **Operations:** Docker, Docker Compose, GitHub, Vercel, Render

## Repository structure

```text
LiverGuard/
├── frontend/       # Next.js web application
├── backend/        # ASP.NET Core API
├── ml-service/     # FastAPI inference service and model artifacts
├── docker-compose.yml
├── run-local.ps1
├── README.md
└── LICENSE
```

## Run locally

### Prerequisites

- Node.js and npm
- .NET SDK 10
- Python 3.12+
- Docker Desktop

### Docker Compose

From the repository root:

```bash
docker compose up --build
```

The API is available at `http://localhost:5000` and the ML service at `http://localhost:8000`.

### Frontend development server

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

### Run services individually

```bash
cd backend
dotnet run
```

```bash
cd ml-service
python -m venv .venv
```

Activate the environment, install dependencies, and start FastAPI:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Configuration

The frontend reads the API base URL from `NEXT_PUBLIC_API_BASE_URL` and defaults to `http://localhost:5000`.

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-host.example.com
```

The backend reads `MlServiceUrl` from configuration. Docker Compose sets it to `http://ml-service:8000`.

## Health endpoints

```text
GET /health
GET /ready
```

## Deployment

The intended deployment layout is:

```text
Frontend  → Vercel
API       → Render
ML service → Render
```

Set the frontend API URL to the deployed backend URL, set the backend ML service URL to the deployed ML service URL, and allow the production frontend origin in the API CORS policy. Free hosting plans may introduce cold-start latency.

## Disclaimer

LiverGuard is intended only for educational and research demonstration purposes. It does not provide medical diagnosis, treatment recommendations, or professional medical advice. If you are concerned about your health, consult a qualified healthcare professional.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
