"use client";

import { FormEvent, useState } from "react";
import {
  Check,
  Flower2,
  LoaderCircle,
  MessageSquareText,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SubmitState = "idle" | "sending" | "sent" | "error";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.get("type"),
          message: formData.get("message"),
          email: formData.get("email"),
          website: formData.get("website"),
          page: window.location.href,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "We couldn't send your feedback.");
      }

      form.reset();
      setStatus("sent");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't send your feedback.",
      );
      setStatus("error");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      window.setTimeout(() => {
        setStatus("idle");
        setError("");
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-5 right-5 rounded-full px-4 shadow-md sm:bottom-6 sm:right-6"
          aria-label="Share feedback"
        >
          <MessageSquareText data-icon="inline-start" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
        {status === "sent" ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-5 px-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Flower2 aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2">
              <DialogTitle className="text-xl">Thank you.</DialogTitle>
              <DialogDescription>
                It helps make Memory Palace better.
              </DialogDescription>
            </div>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Back to the palace
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle>What should we improve?</DialogTitle>
              <DialogDescription>
                Bugs, ideas and small observations are all welcome.
              </DialogDescription>
            </DialogHeader>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="feedback-type">
                  This is a…
                </label>
                <select
                  id="feedback-type"
                  name="type"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                  defaultValue="idea"
                >
                  <option value="idea">Idea</option>
                  <option value="bug">Something went wrong</option>
                  <option value="comment">General comment</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="feedback-message"
                >
                  Your feedback
                </label>
                <Textarea
                  id="feedback-message"
                  name="message"
                  required
                  minLength={3}
                  maxLength={2000}
                  rows={5}
                  placeholder="Tell us what happened or what you'd love to see…"
                  className="min-h-28 resize-y"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="feedback-email">
                  Email{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <Input
                  id="feedback-email"
                  name="email"
                  type="email"
                  maxLength={254}
                  placeholder="you@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Only if you would like a reply.
                </p>
              </div>

              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="feedback-website">Website</label>
                <input
                  id="feedback-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full"
              >
                {status === "sending" ? (
                  <LoaderCircle
                    data-icon="inline-start"
                    className="animate-spin"
                  />
                ) : (
                  <Send data-icon="inline-start" />
                )}
                {status === "sending" ? "Sending…" : "Send feedback"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
