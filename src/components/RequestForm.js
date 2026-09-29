"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import flatpickr from "flatpickr";
import { DESTINATIONS, GET_STARTED, SERVICES } from "@/lib/site-config";

// ISO 3166-1 alpha-2 codes; names come from Intl.DisplayNames.
const COUNTRY_CODES = (
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI KH CM CA CV CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW"
).split(" ");

const toOptions = (list) => list.map((v) => ({ value: v, label: v }));
const countryOptions = () => {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return toOptions(COUNTRY_CODES.map((c) => names.of(c)).sort((a, b) => a.localeCompare(b)));
};

const [PASSPORT_LABEL, APPLY_FROM_LABEL, GOING_TO_LABEL, DATES_LABEL] = GET_STARTED.fields;

const STEPS = [
  { title: GET_STARTED.title.toUpperCase(), fields: ["passport", "applyFrom", "goingTo"] },
  { title: DATES_LABEL.toUpperCase(), fields: ["dates"] },
  { title: "HOW CAN WE HELP?", fields: ["services"] },
  { title: "ENQUIRE", fields: ["name", "email", "mobile", "consent"] },
];

function DateRange({ value, onChange, disabled }) {
  const inputRef = useRef(null);
  const fpRef = useRef(null);

  useEffect(() => {
    const months = () => (window.matchMedia("(max-width: 840px)").matches ? 1 : 2);
    let built = 0;

    // flatpickr sizes itself from the rendered width, so build it only once the
    // calendar is visible (the dialog starts closed) and rebuild on breakpoint change.
    const build = () => {
      fpRef.current?.destroy();
      built = months();
      fpRef.current = flatpickr(inputRef.current, {
        mode: "range",
        inline: true,
        minDate: "today",
        showMonths: built,
        dateFormat: "F j, Y",
        defaultDate: inputRef.current.value ? inputRef.current.value.split(" to ") : undefined,
        locale: { firstDayOfWeek: 1 },
        onChange: (_dates, str) => onChange(str),
      });
    };

    const wrapper = inputRef.current.parentElement;
    const ro = new ResizeObserver(() => {
      if (!wrapper.offsetWidth) return;
      if (!fpRef.current || built !== months()) build();
    });
    ro.observe(wrapper);

    return () => {
      ro.disconnect();
      fpRef.current?.destroy();
      fpRef.current = null;
    };
    // flatpickr owns its own state; onChange identity is stable (react-hook-form field)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputRef.current?.closest(".rf-calendar")?.classList.toggle("is-disabled", !!disabled);
  }, [disabled]);

  return (
    <div className="rf-calendar">
      <input ref={inputRef} type="text" readOnly value={value ?? ""} aria-label={DATES_LABEL} />
    </div>
  );
}

function SelectField({ control, name, label, options, placeholder, required, isMulti = false }) {
  return (
    <div className="rf-field">
      <label className="rf-label" htmlFor={`rf-${name}`}>
        {label.toUpperCase()}
      </label>
      <Controller
        control={control}
        name={name}
        rules={required ? { validate: (v) => (isMulti ? v.length > 0 : !!v) || required } : undefined}
        render={({ field }) => (
          <Select
            {...field}
            instanceId={`rf-${name}`}
            inputId={`rf-${name}`}
            isMulti={isMulti}
            unstyled
            options={options}
            classNamePrefix="rf-select"
            className="rf-select"
            placeholder={placeholder}
            menuPlacement="auto"
          />
        )}
      />
    </div>
  );
}

export default function RequestForm({ context = "" }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [countries] = useState(countryOptions);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      passport: null,
      applyFrom: null,
      goingTo: null,
      dates: "",
      flexible: false,
      services: [],
      name: "",
      email: "",
      mobile: "",
      message: "",
      consent: false,
    },
  });

  const flexible = watch("flexible");
  const last = step === STEPS.length - 1;

  const next = async () => {
    if (await trigger(STEPS[step].fields)) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          passport: data.passport?.value ?? "",
          applyFrom: data.applyFrom?.value ?? "",
          goingTo: data.goingTo?.value ?? "",
          services: data.services.map((s) => s.value),
          context,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rf rf--done">
        <p className="rf-kicker">THANK YOU</p>
        <h3 className="rf-title">Your message has been sent successfully!</h3>
        <p className="rf-text">We welcome your inquiries and look forward to connecting with you.</p>
      </div>
    );
  }

  const firstError = (names) => names.map((n) => errors[n]?.message).find(Boolean);

  return (
    <form className="rf" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="rf-progress" aria-hidden="true">
        <span className="rf-progress__count">
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
        <span className="rf-progress__bar">
          <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </span>
      </div>

      <h3 className="rf-title">{STEPS[step].title}</h3>

      {step === 0 && (
        <div className="rf-step">
          <SelectField control={control} name="passport" label={PASSPORT_LABEL} options={countries} placeholder="Select Country" required="Please select your passport country." />
          <SelectField control={control} name="applyFrom" label={APPLY_FROM_LABEL} options={countries} placeholder="Select Country" required="Please select where you are applying from." />
          <SelectField
            control={control}
            name="goingTo"
            label={GOING_TO_LABEL}
            options={toOptions([...DESTINATIONS, "Other"])}
            placeholder="Select Destination"
            required="Please select your destination."
          />
          {firstError(["passport", "applyFrom", "goingTo"]) && <p className="rf-error">{firstError(["passport", "applyFrom", "goingTo"])}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="rf-step">
          <Controller
            control={control}
            name="dates"
            rules={{ validate: (v) => flexible || v.includes(" to ") || "Please choose your entry and exit dates." }}
            render={({ field }) => <DateRange value={field.value} onChange={field.onChange} disabled={flexible} />}
          />
          <label className="rf-check">
            <input type="checkbox" {...register("flexible")} />
            <span>My dates are flexible</span>
          </label>
          {errors.dates && <p className="rf-error">{errors.dates.message}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="rf-step">
          <SelectField
            control={control}
            name="services"
            label="Services"
            options={toOptions(SERVICES)}
            placeholder="Choose one or more services"
            required="Choose at least one service."
            isMulti
          />
          {errors.services && <p className="rf-error">{errors.services.message}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="rf-step">
          <div className="rf-grid">
            <input className="rf-input rf-grid__full" placeholder="FULL NAME *" autoComplete="name" {...register("name", { required: "Required" })} />
            <input
              className="rf-input"
              type="email"
              placeholder="EMAIL ADDRESS *"
              autoComplete="email"
              {...register("email", {
                required: "Required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." },
              })}
            />
            <input className="rf-input" type="tel" placeholder="CONTACT NUMBER *" autoComplete="tel" {...register("mobile", { required: "Required" })} />
            <textarea className="rf-input rf-grid__full" rows={3} placeholder="TYPE YOUR MESSAGE HERE" {...register("message")} />
          </div>
          {(errors.name || errors.email || errors.mobile) && (
            <p className="rf-error">{errors.email?.message !== "Required" && errors.email?.message ? errors.email.message : "Please fill in the required fields."}</p>
          )}
          <label className="rf-check">
            <input type="checkbox" {...register("consent", { required: "Please accept to continue." })} />
            <span>
              I agree to the <a href="/terms">Terms of Service</a> and the <a href="/privacy-policy">Privacy Policy</a>.
            </span>
          </label>
          {errors.consent && <p className="rf-error">{errors.consent.message}</p>}
          {status === "error" && <p className="rf-error">Something went wrong. Please try again.</p>}
        </div>
      )}

      <div className="rf-nav">
        {step > 0 && (
          <button type="button" className="rf-btn rf-btn--ghost" onClick={() => setStep((s) => s - 1)}>
            BACK
          </button>
        )}
        {last ? (
          <button type="submit" className="rf-btn" disabled={status === "sending"}>
            {status === "sending" ? "SENDING…" : "SUBMIT"}
          </button>
        ) : (
          <button type="button" className="rf-btn" onClick={next}>
            {step === 0 ? GET_STARTED.cta.toUpperCase() : "NEXT"}
          </button>
        )}
      </div>
    </form>
  );
}
