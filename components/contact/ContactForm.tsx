"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, inputClassName, labelClassName, mutedTextClassName } from "@/components/ui/Card";
import { OWNER, ownerWhatsAppUrl } from "@/lib/owner";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";

type ContactFormProps = {
  lang: Language;
};

export function ContactForm({ lang }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      `Hello from ${OWNER.nameEn}`,
      `From: ${name}`,
      email ? `Email: ${email}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(ownerWhatsAppUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className={labelClassName()} htmlFor="contact-name">
            {t(lang, "contactName")}
          </label>
          <input
            id="contact-name"
            required
            className={inputClassName("mt-1")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClassName()} htmlFor="contact-email">
            {t(lang, "contactEmail")}
          </label>
          <input
            id="contact-email"
            type="email"
            required
            className={inputClassName("mt-1")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClassName()} htmlFor="contact-message">
            {t(lang, "contactMessage")}
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            className={inputClassName("mt-1 py-3")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button type="submit" fullWidth>
          {t(lang, "contactSend")}
        </Button>
        {sent ? <p className={mutedTextClassName()}>{t(lang, "contactThanks")}</p> : null}
      </form>
    </Card>
  );
}
