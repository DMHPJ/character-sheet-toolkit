"use client";

import type { ComponentProps, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PanelProps = ComponentProps<"div"> & {
	title?: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
};

export function Panel({ title, description, action, className, children, ...props }: PanelProps) {
	return (
		<Card
			size="sm"
			className={cn(
				"border border-border/70 bg-card/85 shadow-sm shadow-black/20 backdrop-blur",
				className,
			)}
			{...props}>
			{title || description || action ? (
				<CardHeader className="border-b border-border/60">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div className="grid gap-1">
							{title ? <CardTitle className="text-base">{title}</CardTitle> : null}
							{description ? <CardDescription>{description}</CardDescription> : null}
						</div>
						{action ? <div className="shrink-0">{action}</div> : null}
					</div>
				</CardHeader>
			) : null}
			<CardContent className={cn(title || description || action ? "pt-5" : "")}>
				{children}
			</CardContent>
		</Card>
	);
}

export function SubPanel({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"rounded-none border border-border/60 bg-background/35 p-4 shadow-inner shadow-black/10",
				className,
			)}
			{...props}
		/>
	);
}

export function MetricTile({
	label,
	value,
	description,
	className,
}: {
	label: ReactNode;
	value: ReactNode;
	description?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("rounded-none border border-border/60 bg-background/40 p-4", className)}>
			<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
			<div className="mt-1 text-xl font-semibold tabular-nums text-foreground">{value || "—"}</div>
			{description ? <div className="mt-1 text-xs text-muted-foreground">{description}</div> : null}
		</div>
	);
}

export function StatusBadge({
	children,
	tone = "default",
}: {
	children: ReactNode;
	tone?: "default" | "muted" | "success" | "warning" | "danger";
}) {
	const classes = {
		default: "text-primary",
		muted: "text-muted-foreground",
		success: "text-emerald-300",
		warning: "text-amber-300",
		danger: "text-destructive",
	};

	return <Badge className={cn("gap-1", classes[tone])}>{children}</Badge>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
	return <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{children}</label>;
}

export function TextInput({
	label,
	className,
	...props
}: ComponentProps<typeof Input> & {
	label?: ReactNode;
}) {
	return (
		<label className={cn("grid gap-1.5", className)}>
			{label ? <FieldLabel>{label}</FieldLabel> : null}
			<Input {...props} />
		</label>
	);
}

export function TextAreaInput({
	label,
	className,
	...props
}: ComponentProps<typeof Textarea> & {
	label?: ReactNode;
}) {
	return (
		<label className={cn("grid gap-1.5", className)}>
			{label ? <FieldLabel>{label}</FieldLabel> : null}
			<Textarea {...props} />
		</label>
	);
}

export function ReadOnlyBox({
	label,
	value,
	placeholder = "—",
	multiline = false,
	minHeight,
	onClick,
}: {
	label: string;
	value: ReactNode;
	placeholder?: string;
	multiline?: boolean;
	minHeight?: number | string;
	onClick?: () => void;
}) {
	const isEmpty = value === null || value === undefined || value === "";

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={!onClick}
			className={cn(
				"grid w-full gap-1.5 rounded-none border border-border/60 bg-background/35 px-3 py-2 text-left",
				onClick && "cursor-pointer transition-colors hover:bg-muted/40",
				!onClick && "cursor-default",
			)}
			style={{ minHeight }}>
			<FieldLabel>{label}</FieldLabel>
			<span
				className={cn(
					"text-sm text-foreground",
					isEmpty && "text-muted-foreground",
					multiline && "whitespace-pre-wrap break-words",
				)}>
				{isEmpty ? placeholder : value}
			</span>
		</button>
	);
}

export function EmptyHint({ children }: { children: ReactNode }) {
	return (
		<div className="rounded-none border border-dashed border-border/80 px-4 py-5 text-sm text-muted-foreground">
			{children}
		</div>
	);
}

export function Notice({
	title,
	children,
	tone = "info",
}: {
	title: ReactNode;
	children: ReactNode;
	tone?: "info" | "success" | "warning" | "danger";
}) {
	const icon = {
		info: <Info />,
		success: <CheckCircle2 />,
		warning: <TriangleAlert />,
		danger: <AlertCircle />,
	}[tone];

	return (
		<Alert variant={tone === "danger" ? "destructive" : "default"}>
			{icon}
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{children}</AlertDescription>
		</Alert>
	);
}
