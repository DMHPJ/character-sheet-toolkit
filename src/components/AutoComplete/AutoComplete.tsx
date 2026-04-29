"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AutoCompleteOption = {
	value: string;
	label: string;
	description?: string;
	keywords?: string;
};

type AutoCompleteProps = {
	label?: string;
	value: string;
	options: AutoCompleteOption[];
	placeholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
	inputClassName?: string;
	maxItems?: number;
	onInputChange: (value: string) => void;
	onValueChange?: (value: string, option: AutoCompleteOption) => void;
};

export function AutoComplete({
	label,
	value,
	options,
	placeholder,
	emptyText = "没有匹配项",
	disabled = false,
	className,
	inputClassName,
	maxItems = 12,
	onInputChange,
	onValueChange,
}: AutoCompleteProps) {
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [floatingStyle, setFloatingStyle] = useState<CSSProperties | null>(null);
	const anchorRef = useRef<HTMLDivElement>(null);

	const filteredOptions = useMemo(() => {
		const query = value.trim().toLowerCase();
		if (!query) {
			return options;
		}

		return options
			.filter((option) =>
					[option.label, option.value, option.description, option.keywords]
						.filter(Boolean)
						.join(" ")
						.toLowerCase()
						.includes(query),
				)
			.slice(0, maxItems);
	}, [maxItems, options, value]);

	const selectOption = (option: AutoCompleteOption) => {
		onInputChange(option.label);
		onValueChange?.(option.value, option);
		setOpen(false);
		setActiveIndex(0);
	};

	const updateFloatingStyle = () => {
		const rect = anchorRef.current?.getBoundingClientRect();
		if (!rect) {
			return;
		}
		const gap = 4;
		const viewportPadding = 8;
		const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
		const spaceAbove = rect.top - viewportPadding;
		const openAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
		const availableHeight = openAbove ? spaceAbove : spaceBelow;
		const maxHeight = Math.max(80, Math.min(256, availableHeight - gap));

		const maxWidth = window.innerWidth - viewportPadding * 2;
		const width = Math.min(rect.width, maxWidth);
		const left = Math.min(Math.max(viewportPadding, rect.left), window.innerWidth - viewportPadding - width);

		setFloatingStyle({
			left,
			top: openAbove ? Math.max(viewportPadding, rect.top - gap - maxHeight) : rect.bottom + gap,
			width,
			maxHeight,
		});
	};

	useEffect(() => {
		if (!open) {
			return;
		}

		const handlePositionChange = () => updateFloatingStyle();
		window.addEventListener("resize", handlePositionChange);
		window.addEventListener("scroll", handlePositionChange, true);

		return () => {
			window.removeEventListener("resize", handlePositionChange);
			window.removeEventListener("scroll", handlePositionChange, true);
		};
	}, [open]);

	const dropdown = open && !disabled && floatingStyle ? (
		<div
			className="fixed z-50 overflow-y-auto rounded-sm border border-border/70 bg-popover p-1 text-popover-foreground shadow-lg"
			style={floatingStyle}>
			{filteredOptions.length > 0 ? (
				filteredOptions.map((option, index) => {
					const selected = option.label === value || option.value === value;

					return (
						<button
							key={`${option.value}-${index}`}
							type="button"
							className={cn(
								"flex w-full items-start justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
								index === activeIndex && "bg-accent text-accent-foreground",
							)}
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => selectOption(option)}>
							<span className="grid min-w-0 gap-0.5">
								<span className="truncate font-medium">{option.label}</span>
								{option.description ? (
									<span className="truncate text-xs text-muted-foreground">{option.description}</span>
								) : null}
							</span>
							{selected ? <Check className="mt-0.5 shrink-0" /> : null}
						</button>
					);
				})
			) : (
				<div className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</div>
			)}
		</div>
	) : null;

	return (
		<label className={cn("relative grid w-full min-w-0 gap-1.5", className)}>
			{label ? (
				<span className="text-xs font-semibold uppercase tracking-widest break-words text-muted-foreground">
					{label}
				</span>
			) : null}
			<div ref={anchorRef} className="relative min-w-0">
				<Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={value}
					disabled={disabled}
					placeholder={placeholder}
					className={cn("pr-9 pl-9", inputClassName)}
					autoComplete="off"
					role="combobox"
					aria-expanded={open}
					onFocus={() => {
						if (disabled) {
							return;
						}
						updateFloatingStyle();
						setOpen(true);
					}}
					onChange={(event) => {
						onInputChange(event.target.value);
						updateFloatingStyle();
						setOpen(true);
						setActiveIndex(0);
					}}
					onKeyDown={(event) => {
						if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
							setOpen(true);
							return;
						}
						if (event.key === "ArrowDown") {
							event.preventDefault();
							setActiveIndex((index) => Math.min(index + 1, Math.max(0, filteredOptions.length - 1)));
						}
						if (event.key === "ArrowUp") {
							event.preventDefault();
							setActiveIndex((index) => Math.max(0, index - 1));
						}
						if (event.key === "Enter" && open && filteredOptions[activeIndex]) {
							event.preventDefault();
							selectOption(filteredOptions[activeIndex]);
						}
						if (event.key === "Escape") {
							setOpen(false);
						}
					}}
					onBlur={() => setOpen(false)}
				/>
				<ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
			</div>
			{dropdown ? createPortal(dropdown, document.body) : null}
		</label>
	);
}
