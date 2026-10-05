"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowUpRight,
  Info,
} from "lucide-react";

import {
  PredictionInput,
  submitPrediction,
} from "../lib/api";


type FieldKey = Exclude<
  keyof PredictionInput,
  "Height" | "BMI" | "Diabetes"
>;


type Field = {
  key: FieldKey;
  label: string;
  unit: string;
  placeholder: string;
  min: number;
  max: number;
  hint: string;
};


const fields: Field[] = [
  {
    key: "Age",
    label: "Age",
    unit: "years",
    placeholder: "",
    min: 1,
    max: 120,
    hint: "Enter your age",
  },
  {
    key: "Weight",
    label: "Weight",
    unit: "kg",
    placeholder: "",
    min: 20,
    max: 400,
    hint: "Enter your current weight",
  },
  {
    key: "FBS",
    label: "Fasting blood sugar",
    unit: "mg/dL",
    placeholder: "",
    min: 20,
    max: 700,
    hint: "Use a recent fasting blood sugar result when available",
  },
  {
    key: "ALT",
    label: "ALT",
    unit: "U/L",
    placeholder: "",
    min: 0,
    max: 3000,
    hint: "Reference ranges can vary by laboratory",
  },
  {
    key: "AST",
    label: "AST",
    unit: "U/L",
    placeholder: "",
    min: 0,
    max: 3000,
    hint: "Reference ranges can vary by laboratory",
  },
  {
    key: "LDL",
    label: "LDL cholesterol",
    unit: "mg/dL",
    placeholder: "",
    min: 0,
    max: 1000,
    hint: "Enter the value shown on your recent lipid report",
  },
  {
    key: "HDL",
    label: "HDL cholesterol",
    unit: "mg/dL",
    placeholder: "",
    min: 0,
    max: 300,
    hint: "Enter the value shown on your recent lipid report",
  },
  {
    key: "Triglycerides",
    label: "Triglycerides",
    unit: "mg/dL",
    placeholder: "",
    min: 0,
    max: 5000,
    hint: "Enter the value shown on your recent lipid report",
  },
  {
    key: "Cholesterol",
    label: "Total cholesterol",
    unit: "mg/dL",
    placeholder: "",
    min: 0,
    max: 2000,
    hint: "Enter the value shown on your recent lipid report",
  },
];


const initialValues = Object.fromEntries(
  fields.map((field) => [field.key, ""]),
) as Record<FieldKey, string>;


export default function PredictionForm() {
  const [values, setValues] = useState(initialValues);

  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");

  const [manualBmi, setManualBmi] = useState("");

  const [diabetes, setDiabetes] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [slow, setSlow] = useState(false);

  const abortRef = useRef<AbortController | null>(null);


  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);


  function update(
    key: FieldKey,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
  }


  function updateHeight(
    kind: "feet" | "inches",
    value: string,
  ) {
    if (
      kind === "inches" &&
      value !== "" &&
      Number(value) > 11
    ) {
      value = "11";
    }

    if (kind === "feet") {
      setFeet(value);
    } else {
      setInches(value);
    }

    setError("");
  }


  const hasAnyHeight =
    feet !== "" || inches !== "";


  const hasCompleteHeight =
    feet !== "" && inches !== "";


  const calculatedHeightCm =
    useMemo(() => {
      if (!hasCompleteHeight) {
        return null;
      }

      const feetNumber = Number(feet);
      const inchesNumber = Number(inches);

      if (
        !Number.isFinite(feetNumber) ||
        !Number.isFinite(inchesNumber)
      ) {
        return null;
      }

      return (
        (feetNumber * 12 + inchesNumber) *
        2.54
      );
    }, [
      feet,
      inches,
      hasCompleteHeight,
    ]);


  const calculatedBmi =
    useMemo(() => {
      if (
        calculatedHeightCm === null ||
        !values.Weight
      ) {
        return null;
      }

      const weight = Number(values.Weight);

      if (!Number.isFinite(weight)) {
        return null;
      }

      const heightMeters =
        calculatedHeightCm / 100;

      if (heightMeters <= 0) {
        return null;
      }

      return (
        weight /
        Math.pow(heightMeters, 2)
      );
    }, [
      calculatedHeightCm,
      values.Weight,
    ]);


  async function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }


    /* ---------------------------------------------
       Required numeric fields
    ---------------------------------------------- */

    const missing = fields.find(
      (field) =>
        values[field.key].trim() === "",
    );

    if (missing) {
      setError(
        `Please enter ${missing.label.toLowerCase()}.`,
      );

      return;
    }


    /* ---------------------------------------------
       Base field validation
    ---------------------------------------------- */

    const invalid = fields.find(
      (field) => {
        const value =
          Number(values[field.key]);

        return (
          !Number.isFinite(value) ||
          value < field.min ||
          value > field.max
        );
      },
    );

    if (invalid) {
      setError(
        `${invalid.label} needs to be between ${invalid.min} and ${invalid.max}.`,
      );

      return;
    }


    /* ---------------------------------------------
       Diabetes
    ---------------------------------------------- */

    if (
      diabetes !== "0" &&
      diabetes !== "1"
    ) {
      setError(
        "Please select your diabetes diagnosis status.",
      );

      return;
    }


    /* ---------------------------------------------
       Height validation

       Height is required.
    ---------------------------------------------- */

    if (!hasCompleteHeight) {
      setError(
        "Please enter both height fields.",
      );

      return;
    }


    let heightCm: number;


    {
      const feetNumber = Number(feet);
      const inchesNumber = Number(inches);

      if (
        feetNumber < 2 ||
        feetNumber > 8
      ) {
        setError(
          "Feet must be between 2 and 8.",
        );

        return;
      }

      if (
        inchesNumber < 0 ||
        inchesNumber > 11
      ) {
        setError(
          "Inches must be between 0 and 11.",
        );

        return;
      }

      heightCm =
        (feetNumber * 12 +
          inchesNumber) *
        2.54;
    }


    /* ---------------------------------------------
       BMI calculated from required height/weight
    ---------------------------------------------- */

    let bmi: number;


    const weight = Number(values.Weight);
    bmi = weight / Math.pow(heightCm / 100, 2);


    if (
      !Number.isFinite(bmi) ||
      bmi < 5 ||
      bmi > 100
    ) {
      setError(
        "BMI needs to be between 5 and 100.",
      );

      return;
    }


    /* ---------------------------------------------
       Missing Height reconstruction

       This mirrors your deployment rule:
       Height = sqrt(Weight / BMI) × 100
    ---------------------------------------------- */

    /* ---------------------------------------------
       API payload
    ---------------------------------------------- */

    const payload = {
      ...Object.fromEntries(
        fields.map((field) => [
          field.key,
          Number(values[field.key]),
        ]),
      ),

      Height:
        Number(
          heightCm.toFixed(2),
        ),

      BMI:
        Number(
          bmi.toFixed(2),
        ),

      Diabetes:
        Number(diabetes),
    } as PredictionInput;


    /* ---------------------------------------------
       Request
    ---------------------------------------------- */

    abortRef.current?.abort();

    const controller =
      new AbortController();

    abortRef.current =
      controller;


    setLoading(true);
    setError("");
    setSlow(false);

    setStage(
      "Preparing your prediction…",
    );


    /*
       These are interface messages rather than
       claims that the server has reached an exact
       internal processing stage.
    */

    const stageTimer =
      setTimeout(() => {
        setStage(
          "Running the prediction model…",
        );
      }, 700);


    const explanationTimer =
      setTimeout(() => {
        setStage(
          "Preparing your explanation…",
        );
      }, 1800);


    const slowTimer =
      setTimeout(() => {
        setSlow(true);
      }, 3000);


    try {
      const result =
        await submitPrediction(
          payload,
          controller.signal,
        );


      sessionStorage.setItem(
        "liverguard-result",
        JSON.stringify(result),
      );


      window.location.href =
        "/results";

    } catch (error) {
      const requestError =
        error as Error;


      if (
        requestError.name !==
        "AbortError"
      ) {
        setError(
          requestError.message ||
            "We could not complete the prediction. Please try again.",
        );
      }

    } finally {
      clearTimeout(stageTimer);

      clearTimeout(
        explanationTimer,
      );

      clearTimeout(slowTimer);

      setLoading(false);
    }
  }


  return (
    <form
      className="prediction-form"
      onSubmit={submit}
      noValidate
    >

      {/* ===========================================
          HEADER
      ============================================ */}

      <div className="form-heading">

        <div>
          <p className="eyebrow">
            YOUR HEALTH MARKERS
          </p>

          <h2>
            Enter your details
          </h2>
        </div>

        <span className="required-note">
          All fields required
        </span>

      </div>


      <div className="form-grid">

        {/* =========================================
            AGE
        ========================================== */}

        {fields
          .filter(
            (field) =>
              field.key === "Age",
          )
          .map((field) => (
            <NumericField
              key={field.key}
              field={field}
              value={
                values[field.key]
              }
              update={update}
            />
          ))}


        {/* =========================================
            HEIGHT
        ========================================== */}

        <label className="field height-field">

          <span className="field-label">
            Height
            <small>
            </small>
          </span>


          <div className="height-inputs">

            <span className="input-wrap">

              <input
                inputMode="numeric"
                type="number"
                min="2"
                max="8"
                step="1"
                value={feet}
                onChange={(event) =>
                  updateHeight(
                    "feet",
                    event.target.value,
                  )
                }
                aria-label="Height in feet"
              />

              <span>
                ft
              </span>

            </span>


            <span className="height-and">
              and
            </span>


            <span className="input-wrap">

              <input
                inputMode="numeric"
                type="number"
                min="0"
                max="11"
                step="1"
                value={inches}
                onChange={(event) =>
                  updateHeight(
                    "inches",
                    event.target.value,
                  )
                }
                aria-label="Height in inches"
              />

              <span>
                in
              </span>

            </span>

          </div>


          <span className="field-hint">
            Enter height in feet and inches.
          </span>

        </label>


        {/* =========================================
            WEIGHT
        ========================================== */}

        {fields
          .filter(
            (field) =>
              field.key === "Weight",
          )
          .map((field) => (
            <NumericField
              key={field.key}
              field={field}
              value={
                values[field.key]
              }
              update={update}
            />
          ))}


        {/* =========================================
            BMI
        ========================================== */}

        {true ? (

          <div className="bmi-preview">

            <span className="bmi-label">
              BMI
            </span>

            <strong>
              {calculatedBmi !== null
                ? calculatedBmi.toFixed(1)
                : "—"}
            </strong>

            <span>
              calculated from height and weight
            </span>

          </div>

        ) : (

          <label className="field bmi-manual-field">

            <span className="field-label">
              BMI
            </span>

            <span className="input-wrap">

              <input
                inputMode="decimal"
                type="number"
                min="5"
                max="100"
                step="0.1"
                placeholder="28.4"
                value={manualBmi}
                onChange={(event) => {
                  setManualBmi(
                    event.target.value,
                  );

                  setError("");
                }}
              />

              <span>
                kg/m²
              </span>

            </span>

            <span className="field-hint">
              Required when height is not provided
            </span>

          </label>

        )}


        {/* =========================================
            REMAINING NUMERIC FIELDS
        ========================================== */}

        {fields
          .filter(
            (field) =>
              field.key !== "Age" &&
              field.key !== "Weight",
          )
          .map((field) => (
            <NumericField
              key={field.key}
              field={field}
              value={
                values[field.key]
              }
              update={update}
            />
          ))}


        {/* =========================================
            DIABETES
        ========================================== */}

        <label className="field">

          <span className="field-label">
            Diabetes diagnosis
          </span>


          <span className="input-wrap">

            <select
              value={diabetes}
              onChange={(event) => {
                setDiabetes(
                  event.target.value,
                );

                setError("");
              }}
              aria-label="Diabetes diagnosis"
            >

              <option value="">
                Select
              </option>

              <option value="0">
                No
              </option>

              <option value="1">
                Yes
              </option>

            </select>

          </span>


          <span className="field-hint">
            Select whether you have been
            diagnosed with diabetes
          </span>

        </label>

      </div>


      {/* ===========================================
          SUBMISSION
      ============================================ */}

      <div className="form-bottom">

        <p className="form-footnote">

          <Info
            size={14}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>
            Values are processed for this
            prediction and are not stored
            by default.
          </span>

        </p>


        {error && (

          <p
            className="form-error"
            role="alert"
          >
            {error}
          </p>

        )}


        {loading && (

          <div
            className="progress"
            role="status"
            aria-live="polite"
          >

            <span
              className="spinner"
              aria-hidden="true"
            />

            <span>
              {stage}
            </span>


            {slow && (

              <small>
                The prediction service may
                take a little longer when
                starting up.
              </small>

            )}

          </div>

        )}


        <button
          className="button submit-button"
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Working…"
            : "Generate my estimate"}

          {!loading && (

            <ArrowUpRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />

          )}

        </button>

      </div>

    </form>
  );
}


/* =========================================================
   REUSABLE NUMERIC FIELD
========================================================= */

function NumericField({
  field,
  value,
  update,
}: {
  field: Field;
  value: string;
  update: (
    key: FieldKey,
    value: string,
  ) => void;
}) {
  return (
    <label
      className={`field field-${field.key}`}
    >

      <span className="field-label">
        {field.label}
      </span>


      <span className="input-wrap">

        <input
          inputMode="decimal"
          type="number"
          step="any"
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) =>
            update(
              field.key,
              event.target.value,
            )
          }
          aria-describedby={`${field.key}-hint`}
        />

        <span>
          {field.unit}
        </span>

      </span>


      <span
        className="field-hint"
        id={`${field.key}-hint`}
      >
        {field.hint}
      </span>

    </label>
  );
}
