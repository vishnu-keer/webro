'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from 'lucide-react';
import * as React from 'react';

import Button from '@/components/ui/Button';
import { BUDGET_RANGES, PROJECT_TYPES, TIMELINES } from '@/lib/data';
import { cn, EASE_LUX } from '@/lib/utils';

type FormState = {
  projectType: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  message: string;
};

const INITIAL: FormState = {
  projectType: '',
  budget: '',
  timeline: '',
  name: '',
  email: '',
  company: '',
  message: '',
};

const STEPS = [
  { id: 0, label: 'Project' },
  { id: 1, label: 'Scope' },
  { id: 2, label: 'Details' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Three-step qualification form. Client-side validated, submit-ready. */
export default function InquiryForm() {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<FormState>(INITIAL);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'done'>('idle');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep = (target: number) => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (target === 0 && !form.projectType) {
      next.projectType = 'Pick the closest match.';
    }

    if (target === 1) {
      if (!form.budget) next.budget = 'Select a range so we can scope realistically.';
      if (!form.timeline) next.timeline = 'When do you need this live?';
    }

    if (target === 2) {
      if (!form.name.trim()) next.name = 'Your name, please.';
      if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.';
      if (form.message.trim().length < 20) {
        next.message = 'A couple of sentences helps us give a useful reply.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep(2)) return;

    setStatus('submitting');

    // Wire this to /api/contact, Resend, or your CRM of choice.
    await new Promise((resolve) => setTimeout(resolve, 1100));

    setStatus('done');
  };

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_LUX }}
        className="glass flex flex-col items-center p-10 text-center sm:p-14"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-7 font-display text-3xl tracking-tight text-white">
          Thanks, {form.name.split(' ')[0] || 'there'}.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
          Your brief landed. We read every inquiry personally and reply within one business day —
          usually with a couple of sharp questions rather than a generic deck.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(INITIAL);
            setStep(0);
            setStatus('idle');
          }}
          className="mt-8 text-sm text-white/40 underline underline-offset-4 transition-colors hover:text-white"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass p-7 sm:p-9">
      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {STEPS.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] transition-all duration-500',
                  index < step && 'border-gold/40 bg-gold/15 text-gold',
                  index === step && 'border-white/30 bg-white text-obsidian',
                  index > step && 'border-white/10 text-white/30',
                )}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-[11px] uppercase tracking-[0.18em] transition-colors duration-500 sm:block',
                  index === step ? 'text-white' : 'text-white/30',
                )}
              >
                {item.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div className="h-px flex-1 bg-white/10">
                <motion.div
                  className="h-px bg-gold/50"
                  initial={{ width: 0 }}
                  animate={{ width: index < step ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: EASE_LUX }}
                />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div className="hairline my-8" />

      <AnimatePresence mode="wait">
        {/* ---------------- Step 1 — project type ---------------- */}
        {step === 0 ? (
          <motion.fieldset
            key="step-0"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: EASE_LUX }}
          >
            <legend className="font-display text-2xl tracking-tight text-white">
              What are we building?
            </legend>
            <p className="mt-3 text-sm text-white/45">
              Pick the closest match — we&apos;ll refine it on the call.
            </p>

            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {PROJECT_TYPES.map((type) => (
                <label
                  key={type}
                  className={cn(
                    'cursor-pointer rounded-xl border px-4 py-4 text-sm transition-all duration-300',
                    form.projectType === type
                      ? 'border-gold/40 bg-gold/[0.07] text-white'
                      : 'border-white/[0.08] bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white',
                  )}
                >
                  <input
                    type="radio"
                    name="projectType"
                    value={type}
                    checked={form.projectType === type}
                    onChange={(event) => update('projectType', event.target.value)}
                    className="sr-only"
                  />
                  {type}
                </label>
              ))}
            </div>

            {errors.projectType ? (
              <p role="alert" className="mt-4 text-[13px] text-rose-400/90">
                {errors.projectType}
              </p>
            ) : null}
          </motion.fieldset>
        ) : null}

        {/* ---------------- Step 2 — budget & timeline ---------------- */}
        {step === 1 ? (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: EASE_LUX }}
            className="space-y-10"
          >
            <fieldset>
              <legend className="font-display text-2xl tracking-tight text-white">
                What&apos;s the budget?
              </legend>
              <p className="mt-3 text-sm text-white/45">
                An honest range saves us both a meeting.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {BUDGET_RANGES.map((range) => (
                  <label
                    key={range}
                    className={cn(
                      'cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-all duration-300',
                      form.budget === range
                        ? 'border-gold/40 bg-gold/[0.07] text-white'
                        : 'border-white/[0.08] bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white',
                    )}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value={range}
                      checked={form.budget === range}
                      onChange={(event) => update('budget', event.target.value)}
                      className="sr-only"
                    />
                    {range}
                  </label>
                ))}
              </div>

              {errors.budget ? (
                <p role="alert" className="mt-4 text-[13px] text-rose-400/90">
                  {errors.budget}
                </p>
              ) : null}
            </fieldset>

            <fieldset>
              <legend className="font-display text-2xl tracking-tight text-white">
                And the timeline?
              </legend>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {TIMELINES.map((option) => (
                  <label
                    key={option}
                    className={cn(
                      'cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-all duration-300',
                      form.timeline === option
                        ? 'border-gold/40 bg-gold/[0.07] text-white'
                        : 'border-white/[0.08] bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white',
                    )}
                  >
                    <input
                      type="radio"
                      name="timeline"
                      value={option}
                      checked={form.timeline === option}
                      onChange={(event) => update('timeline', event.target.value)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>

              {errors.timeline ? (
                <p role="alert" className="mt-4 text-[13px] text-rose-400/90">
                  {errors.timeline}
                </p>
              ) : null}
            </fieldset>
          </motion.div>
        ) : null}

        {/* ---------------- Step 3 — contact details ---------------- */}
        {step === 2 ? (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: EASE_LUX }}
          >
            <h2 className="font-display text-2xl tracking-tight text-white">
              Where do we reply?
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field
                id="name"
                label="Full name"
                value={form.name}
                onChange={(value) => update('name', value)}
                error={errors.name}
                autoComplete="name"
                required
              />
              <Field
                id="email"
                label="Work email"
                type="email"
                value={form.email}
                onChange={(value) => update('email', value)}
                error={errors.email}
                autoComplete="email"
                required
              />
              <div className="sm:col-span-2">
                <Field
                  id="company"
                  label="Company"
                  hint="optional"
                  value={form.company}
                  onChange={(value) => update('company', value)}
                  autoComplete="organization"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-[11px] uppercase tracking-[0.18em] text-white/40"
                >
                  Tell us about the project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(event) => update('message', event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  placeholder="What are you building, who is it for, and what does success look like?"
                  className="mt-3 w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 text-sm text-white placeholder:text-white/25 transition-colors duration-300 focus:border-gold/40 focus:outline-none"
                />
                {errors.message ? (
                  <p id="message-error" role="alert" className="mt-2 text-[13px] text-rose-400/90">
                    {errors.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Summary of earlier answers */}
            <div className="mt-8 flex flex-wrap gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              {[form.projectType, form.budget, form.timeline].filter(Boolean).map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] text-white/45"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-9 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={goNext} size="lg">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send inquiry
                <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Field primitive                                                     */
/* ------------------------------------------------------------------ */

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
};

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  required,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] uppercase tracking-[0.18em] text-white/40">
        {label}
        {hint ? <span className="ml-2 normal-case tracking-normal text-white/25">{hint}</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-3 h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white placeholder:text-white/25 transition-colors duration-300 focus:border-gold/40 focus:outline-none"
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] text-rose-400/90">
          {error}
        </p>
      ) : null}
    </div>
  );
}
