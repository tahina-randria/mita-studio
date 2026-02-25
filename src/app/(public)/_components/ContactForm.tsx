"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { Check, CircleNotch } from "@phosphor-icons/react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

const SERVICES = [
  { value: "", label: "S\u00e9lectionnez un service" },
  { value: "site-web", label: "Site web" },
  { value: "seo", label: "R\u00e9f\u00e9rencement Google" },
  { value: "outil-digital", label: "Outil digital sur mesure" },
  { value: "pack-complet", label: "Site + r\u00e9f\u00e9rencement (pack complet)" },
  { value: "autre", label: "Autre" },
];

const BUDGETS = [
  { value: "", label: "Budget envisag\u00e9" },
  { value: "< 1 000 \u20ac", label: "Moins de 1\u00a0000\u00a0\u20ac" },
  { value: "1 000 - 2 500 \u20ac", label: "1\u00a0000 \u2013 2\u00a0500\u00a0\u20ac" },
  { value: "2 500 - 5 000 \u20ac", label: "2\u00a0500 \u2013 5\u00a0000\u00a0\u20ac" },
  { value: "5 000+ \u20ac", label: "Plus de 5\u00a0000\u00a0\u20ac" },
  { value: "pas encore d\u00e9fini", label: "Pas encore d\u00e9fini" },
];

const INPUT_CLASSES =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/40 transition-colors";

const SELECT_CLASSES =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/40 transition-colors appearance-none cursor-pointer";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Animate success state
  useEffect(() => {
    if (status === "success" && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors?.length) {
          setErrorMessage(data.errors[0].message);
        } else {
          setErrorMessage(data.error ?? "Une erreur est survenue.");
        }
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Erreur de connexion. V\u00e9rifiez votre r\u00e9seau.");
      setStatus("error");
    }
  };

  // Success state
  if (status === "success") {
    return (
      <div
        ref={successRef}
        className="flex flex-col items-center justify-center text-center py-12 sm:py-16"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] mb-6">
          <Check size={28} weight="bold" className="text-white" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">
          Message envoy&eacute;&nbsp;!
        </h3>
        <p className="text-sm text-white max-w-sm">
          Merci pour votre message. On revient vers vous sous 24h
          avec une premi&egrave;re r&eacute;ponse.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs text-white mb-1.5">
            Nom complet *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jean Dupont"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-white mb-1.5">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jean@entreprise.com"
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-xs text-white mb-1.5">
            T&eacute;l&eacute;phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-xs text-white mb-1.5">
            Entreprise
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nom de votre entreprise"
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      {/* Service + Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="service" className="block text-xs text-white mb-1.5">
            Service
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={SELECT_CLASSES}
          >
            {SERVICES.map((s) => (
              <option key={s.value} value={s.value} className="bg-white text-[#0a0a0a]">
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="block text-xs text-white mb-1.5">
            Budget
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className={SELECT_CLASSES}
          >
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value} className="bg-white text-[#0a0a0a]">
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs text-white mb-1.5">
          Votre projet *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Décrivez votre projet, vos objectifs, vos délais…"
          className={`${INPUT_CLASSES} resize-none`}
        />
      </div>

      {/* Error */}
      {status === "error" && errorMessage && (
        <p role="alert" aria-live="assertive" className="text-sm text-red-400">{errorMessage}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-[#0a0a0a] hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "loading" ? (
          <>
            <CircleNotch size={16} className="animate-spin" aria-hidden="true" />
            Envoi en cours&hellip;
          </>
        ) : (
          "Envoyer mon message"
        )}
      </button>

      <p className="text-center text-[11px] text-white">
        Vos donn&eacute;es sont prot&eacute;g&eacute;es et ne seront jamais partag&eacute;es.
      </p>
    </form>
  );
}
