"use client";

import type { ReactNode } from "react";
import { ReadOnlyBox } from "@/components/SheetPrimitives/SheetPrimitives";

export default function ReadOnlyField({
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
	return (
		<ReadOnlyBox
			label={label}
			value={value}
			placeholder={placeholder}
			multiline={multiline}
			minHeight={minHeight}
			onClick={onClick}
		/>
	);
}
