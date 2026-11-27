"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { answerBot, botWelcome, type BotReply } from "@/lib/bot";

type Message = {
  id: number;
  role: "bot" | "user";
  reply: BotReply;
};

export function StoreBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", reply: botWelcome },
  ]);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function send(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const reply = answerBot(trimmed);
    setMessages((previous) => [
      ...previous,
      { id: nextId.current++, role: "user", reply: { text: trimmed } },
      { id: nextId.current++, role: "bot", reply },
    ]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  const lastBotId = [...messages].reverse().find((message) => message.role === "bot")?.id;

  return (
    <>
      <button
        type="button"
        className="btn btn-primary fixed bottom-4 right-4 z-40 shadow-lg"
        aria-expanded={open}
        aria-controls="assistant-boutique"
        onClick={() => setOpen((value) => !value)}
      >
        Assistant
      </button>

      {open ? (
        <section
          id="assistant-boutique"
          role="dialog"
          aria-label="Assistant de la boutique"
          className="glass-strong panel-opaque fixed bottom-16 right-4 z-40 flex max-h-[calc(100dvh-5rem)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl shadow-2xl animate-fade-up"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Assistant boutique</p>
              <p className="text-xs text-muted">Réponses automatiques, sans IA externe.</p>
            </div>
            <button
              type="button"
              className="rounded-full px-2 py-1 text-sm text-muted hover:bg-surface-alt"
              aria-label="Fermer l’assistant"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </header>

          <div
            ref={listRef}
            className="flex min-h-0 max-h-72 flex-col gap-3 overflow-y-auto px-4 py-3 sm:max-h-80"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                <p
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-sm text-white"
                      : "max-w-[90%] rounded-2xl rounded-bl-sm bg-surface-alt px-3 py-2 text-sm"
                  }
                >
                  {message.reply.text}
                </p>

                {message.reply.links?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {message.reply.links.map((link) =>
                      link.href.startsWith("/") ? (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-full border border-line px-3 py-1 text-xs font-medium hover:bg-surface-alt"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          key={link.href}
                          href={link.href}
                          className="rounded-full border border-line px-3 py-1 text-xs font-medium hover:bg-surface-alt"
                        >
                          {link.label}
                        </a>
                      ),
                    )}
                  </div>
                ) : null}

                {message.id === lastBotId && message.reply.suggestions?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {message.reply.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
                        onClick={() => send(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-3">
            <label htmlFor="assistant-message" className="sr-only">
              Votre message
            </label>
            <input
              ref={inputRef}
              id="assistant-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Écrire un message…"
              className="min-w-0 flex-1 rounded-2xl border border-line bg-surface-solid px-3 py-2 text-sm"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary px-4" disabled={!input.trim()}>
              Envoyer
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}
